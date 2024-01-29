import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Store, StoreSchema } from './schemas/store.schema';
import { UserModule } from 'src/user/user.module';
import {
  StoreLocation,
  StoreLocationSchema,
} from './schemas/store-location.schema';
import { WalletModule } from 'src/wallet/wallet.module';
import {
  StoreRegistrationToken,
  StoreRegistrationTokenSchema,
} from './schemas/store-registration-token.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Store.name, schema: StoreSchema },
      { name: StoreLocation.name, schema: StoreLocationSchema },
      {
        name: StoreRegistrationToken.name,
        schema: StoreRegistrationTokenSchema,
      },
    ]),
    UserModule,
    WalletModule,
  ],
  controllers: [StoreController],
  providers: [StoreService],
  exports: [StoreService],
})
export class StoreModule {}
