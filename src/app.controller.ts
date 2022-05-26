import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';

interface JSON {
  [key: string]: any;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): JSON {
    return this.appService.getHello();
  }

  @Get('/auth')
  async authPinata(): Promise<any> {
    return await this.appService.authPinata();
  }

  @Get('/get-images')
  async getImages(): Promise<string> {
    return await this.appService.getImages();
  }

  @Get('/get-metadata')
  async getMetadata(): Promise<any> {
    return await this.appService.getMetadata();
  }

  @Get('/delete-resource')
  async deleteResource(@Query() params): Promise<any> {
    return await this.appService.deleteResource(params);
  }

  @Post('/create-nft')
  @UseInterceptors(FileInterceptor('image'))
  async uploadMetadata(@UploadedFile() file, @Body() body): Promise<any> {
    return await this.appService.mintNft(file, body);
  }
}
