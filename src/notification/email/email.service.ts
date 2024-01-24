import { Injectable, Logger } from '@nestjs/common';
import {
  IEmailConfirmationRequest,
  INotificationData,
  IPasswordChangeRequest,
} from '../types';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  emailLogger = new Logger(EmailService.name);
  private logo;
  private twitterLogo;
  private instagramLogo;
  private facebookLogo;
  private linkedinLogo;
  private emailIllustration1;

  async sendMail({
    recipientMail,
    subject,
    name,
    title,
    body,
    extraInfo,
  }: {
    recipientMail: string;
    subject: string;
    name: string;
    title: string;
    body: string;
    extraInfo?: string;
  }) {
    const response = await this.mailerService.sendMail({
      to: recipientMail,
      // from: '"Support Team" <support@example.com>', // override default from
      subject,
      template: 'mail',
      context: {
        logo: this.logo,
        title,
        name,
        body,
        extraInfo: extraInfo || false,
        twitterLogo: this.twitterLogo,
        twitterLink: this.configService.get('TWITTER_LINK'),
        instagramLogo: this.instagramLogo,
        instagramLink: this.configService.get('INSTAGRAM_LINK'),
        facebookLogo: this.facebookLogo,
        facebookLink: this.configService.get('FACEBOOK_LINK'),
        linkedinLogo: this.linkedinLogo,
        linkedinLink: this.configService.get('LINKEDIN_LINK'),
        emailIllustration: this.emailIllustration1,
      },
    });
    return response;
  }

  async sendEmailConfirmationRequestNotification(
    data: INotificationData<IEmailConfirmationRequest>,
    ref: string,
  ) {
    const response = await this.sendMail({
      recipientMail: data.user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: data.subject,
      body: `
        Please use this token
        <strong>${data.data.token}</strong>
        to confirm your email
      `,
      title: 'Welcome To The Idea Bank',
      name: data.name,
      extraInfo: data.extraInfo,
    });
    this.emailLogger.log(
      `ref:${ref} registration confirmation request email sent to ${response.accepted}`,
    );
    // return response;
  }
  async sendEmailConfirmationSuccessNotification(
    data: INotificationData<null>,
    ref: string,
  ) {
    const response = await this.sendMail({
      recipientMail: data.user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: data.subject,
      body: `
        Email Confirmation successfull
      `,
      title: data.title,
      name: data.name,
      extraInfo: data.extraInfo,
    });
    this.emailLogger.log(
      `ref:${ref} registration confirmation success email sent to ${response.accepted}`,
    );
    // return response;
  }

  async sendChangePasswordUrlNotification(
    data: INotificationData<IPasswordChangeRequest>,
    ref: string,
  ) {
    const response = await this.sendMail({
      recipientMail: data.user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: data.subject,
      body: `
      Use this link <a href="${data.data.url}">Link</a> to change your password
    `,
      title: data.title,
      name: data.name,
      extraInfo: data.extraInfo,
    });
    this.emailLogger.log(
      `ref:${ref} password change request email sent to ${response.accepted}`,
    );
    // return response;
  }

  async sendChangePasswordConfirmationEmail(
    data: INotificationData<IPasswordChangeRequest>,
    ref: string,
  ) {
    const response = await this.sendMail({
      recipientMail: data.user.email,
      subject: data.subject,
      body: `
        Password change successfull
      `,
      title: data.title,
      name: data.name,
      extraInfo: data.extraInfo,
    });
    this.emailLogger.log(
      `ref:${ref} password reset confirmation email sent to ${response.accepted}`,
    );
    return response;
  }
}
