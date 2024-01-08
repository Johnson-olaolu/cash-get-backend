import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { StoreModule } from './store/store.module';
import { NotificationModule } from './notification/notification.module';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './utils/env.validate';
import { DatabaseModule } from './database/database.module';
import { SeedService } from './seed/seed.service';

@Module({
  imports: [
    AuthModule,
    UserModule,
    StoreModule,
    NotificationModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeedService],
})
export class AppModule {}