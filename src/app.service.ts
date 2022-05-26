/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import {
  PinataClient,
  PinataMetadata,
  PinataPinListFilterOptions,
  PinataPinOptions,
  PinataPinPolicyItem,
} from '@pinata/sdk';
const pinataSDK = require('@pinata/sdk');
const { Readable } = require('stream');

const pinata: PinataClient = pinataSDK(
  '44e1902fce98eae3f419',
  '793c2f75de8d08b1d28a9f014f2db66e93d8bcc6cf32bffe0fef3cf1172b8a02',
);

const getFilter = (type: string): PinataPinListFilterOptions => {
  return {
    metadata: {
      keyvalues: {
        type: {
          value: type,
          op: 'eq',
        },
      },
    },
  };
};

const getPinOptions = (where: string): PinataPinOptions => {
  return {
    pinataMetadata: {
      name: where,
    },
    // pinataOptions: {
    //   wrapWithDirectory: true,
    // },
  };
};

interface MetadataBody {
  metadata: string;
}

@Injectable()
export class AppService {
  getHello(): { [key: string]: any } {
    return { alive: true, message: 'Hello World!' };
  }

  async authPinata(): Promise<any> {
    return await pinata.testAuthentication();
  }

  async getImages(): Promise<any> {
    return await pinata.pinList(getFilter('images'));
    // return 'Hello World!';
  }

  async getMetadata(): Promise<any> {
    return await pinata.pinList(getFilter('metadata'));
  }

  async deleteResource({ cid }: { [key: string]: string }): Promise<any> {
    return await pinata.unpin(cid);
  }

  async mintNft(img: any, { metadata }: MetadataBody): Promise<any> {
    console.log(img);
    let stream = Readable.from(img.buffer);
    const name = `${Math.floor(
      Math.random() * 100000,
    )}-${new Date().toString()}`;
    stream.path = name;
    const imgInIPFS = await pinata.pinFileToIPFS(stream);
    const newMeta = {
      ...JSON.parse(metadata),
      properties: {
        files: [
          {
            uri: `ipfs://${imgInIPFS.IpfsHash}`, // se suben no a un folder, entonces ya no va la refe a la imagen adentro de ese cid, ese cid es la imagen (YA VUELVO) daleee
            type: img.mimetype,
          },
        ],
      },
    };
    const metadataInIPFS = await pinata.pinJSONToIPFS(
      newMeta,
      getPinOptions(name),
    );
    const res = {
      metadata: metadataInIPFS.IpfsHash,
      image: imgInIPFS.IpfsHash,
      message: 'Your NFT image and metadata has been created!',
    };
    return res;
  }
}
