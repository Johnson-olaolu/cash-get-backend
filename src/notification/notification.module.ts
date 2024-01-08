import { Global, Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EmailService } from './email/email.service';
import { PushService } from './push/push.service';
import { AppService } from './app/app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      // transport: 'smtps://user@example.com:topsecret@smtp.example.com',
      // or
      useFactory: async (configService: ConfigService) => ({
        transport: {
          service: 'gmail',
          // host: configService.get('EMAIL_HOST'),
          // secure: false,
          auth: {
            user: configService.get('EMAIL_USER'),
            pass: configService.get('EMAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `Cash Get ${configService.get('EMAIL_USER')}`,
        },
        template: {
          dir: join(__dirname, '../templates/mail'),
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
        options: {
          partials: {
            dir: join(__dirname, '../templates/mail', 'partials'),
            options: {
              strict: true,
            },
          },
        },
      }),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
  ],
  providers: [NotificationService, EmailService, PushService, AppService],
  exports: [NotificationService],
})
export class NotificationModule {}
