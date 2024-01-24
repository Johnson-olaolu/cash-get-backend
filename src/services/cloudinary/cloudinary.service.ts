import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryFoldersEnum } from 'src/utils/constants';

@Injectable()
export class CloudinaryService {
  logger = new Logger(CloudinaryService.name);
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: configService.get('CLOUDINARY_NAME'),
      api_key: configService.get('CLOUDINARY_API_KEY'),
      api_secret: configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async upload(file: string, folder: CloudinaryFoldersEnum) {
    const result = await cloudinary.uploader.upload(file, {
      folder: `cash-get-${folder}`,
    });
    this.logger.log(`Data uploaded successfully`);
    return result;
  }
}
