import { Global, Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { MonnifyService } from './monnify/monnify.service';
import { HttpModule } from '@nestjs/axios';

@Global()
@Module({
  imports: [HttpModule],
  providers: [CloudinaryService, MonnifyService],
  exports: [CloudinaryService, MonnifyService],
})
export class ServicesModule {}
