/* eslint-disable @typescript-eslint/ban-types */
import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserRolesEnum, superAdminDetails } from 'src/utils/constants';
import { NotificationService } from 'src/notification/notification.service';
import * as otpGenerator from 'otp-generator';
import * as moment from 'moment-timezone';
import { ConfigService } from '@nestjs/config';
import { encryptData } from '../utils/encryption';
import { ChangePasswordDto } from 'src/auth/dto/change-password.dto';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly configService: ConfigService,
    private notificationService: NotificationService,
  ) {}

  async createAgent(createUserDto: CreateUserDto) {
    const newUser = new this.userModel({
      ...createUserDto,
      role: UserRolesEnum.AGENT,
    });
    const emailSentUser = await this.generateConfirmEmailToken(newUser);
    return emailSentUser;
  }

  async createStoreManager(createUserDto: CreateUserDto) {
    const newUser = new this.userModel({
      ...createUserDto,
      role: UserRolesEnum.STORE_MANAGER,
    });
    const emailSentUser = await this.generateConfirmEmailToken(newUser);
    await emailSentUser.save();
    return emailSentUser;
  }

  async seedSuperAdmin() {
    const existingSuperAdmin = await this.userModel.findOne({
      role: UserRolesEnum.SUPER_ADMIN,
    });
    if (!existingSuperAdmin) {
      const superAdmin = await this.userModel.create({
        ...superAdminDetails,
        role: UserRolesEnum.SUPER_ADMIN,
      });
      this.logger.log(`superAdmin seeded ${superAdmin._id}`);
    }
  }

  async findAll() {
    const users = await this.userModel.find();
    return users;
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException(`User Not found for this ID:${id}`);
    }
    return user;
  }

  async fetchDetails(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException(`User Not found for this ID:${id}`);
    }
    return user;
  }

  async findOneByEmailOrUserName(emailOrUserName: string) {
    const user = await this.userModel.findOne({
      $or: [{ email: emailOrUserName }, { userName: emailOrUserName }],
    });
    if (!user) {
      throw new NotFoundException(
        `User Not found for this email or UserName:${emailOrUserName}`,
      );
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    for (const detail in updateUserDto) {
      user[detail] = updateUserDto[detail];
    }
    await user.save();
    return user;
  }

  async remove(id: string) {
    const res = await this.userModel.findByIdAndDelete(id);
    if (!res.ok) {
      throw new NotFoundException(`User Not found for this ID:${id}`);
    }
    return true;
  }

  //email confirmation
  async generateConfirmEmailToken(
    // eslint-disable-next-line @typescript-eslint/ban-types
    user: UserDocument,
  ) {
    const verificationToken = otpGenerator.generate(4, {
      digits: true,
      lowerCaseAlphabets: false,
      specialChars: false,
      upperCaseAlphabets: false,
    });
    const expire = moment().add(15, 'minutes');
    user.emailConfirmationToken = verificationToken;
    user.emailConfirmationTTL = expire.toDate();
    this.notificationService.sendEmailConfirmationRequestNotification({
      title: 'Email Confirmed',
      extraInfo: '',
      name: `${user.firstName} ${user.lastName} `,
      user: user,
      subject: 'Confirm Email',
      data: {
        token: verificationToken,
      },
    });
    await user.save();
    return user;
  }

  async confirmUserEmail(email: string, token: string) {
    const user = await this.findOneByEmailOrUserName(email);
    const currentDate = moment(moment.now()).toDate().valueOf();

    if (currentDate > moment(user.emailConfirmationTTL).toDate().valueOf()) {
      throw new UnauthorizedException('Token Expired');
    }
    if (token !== user.emailConfirmationToken) {
      throw new UnauthorizedException('Invalid Token');
    }
    user.emailConfirmed = true;
    user.emailConfirmationTTL = null;
    user.emailConfirmationToken = null;
    await this.notificationService.sendEmailConfirmationSuccessNotification({
      title: 'Email Confirmed',
      extraInfo: '',
      name: `${user.firstName} ${user.lastName} `,
      user: user,
      subject: 'Confirm Email',
    });

    await user.save();
    return user;
  }

  //password reset
  //Handle Password change
  async generatePasswordResetLink(email: string) {
    const user = await this.findOneByEmailOrUserName(email);
    await this.generatePasswordResetToken(user);
  }

  async generatePasswordResetToken(user: UserDocument) {
    const passwordResetToken = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      specialChars: false,
      upperCaseAlphabets: false,
    });

    const expire = moment().add(15, 'minutes');

    user.passwordResetToken = passwordResetToken;
    user.passwordResetTTL = moment(expire, true).tz('Africa/Lagos').toDate();
    const details = {
      email: user.email,
      token: user.passwordResetToken,
    };
    const token = encryptData(JSON.stringify(details));
    const passwordResetUrl = `${this.configService.get(
      'CLIENT_URL',
    )}/auth/reset-password?details=${token}`;
    this.notificationService.sendChangePasswordRequestNotification({
      title: 'Password Change Request',
      extraInfo: '',
      name: `${user.firstName} ${user.lastName} `,
      user: user,
      subject: 'Change Passsword',
      data: {
        url: passwordResetUrl,
      },
    });
    await user.save();
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    const user = await this.findOneByEmailOrUserName(changePasswordDto.email);
    const currentDate = moment(moment.now()).toDate().valueOf();

    if (currentDate > moment(user.passwordResetTTL).valueOf()) {
      throw new UnauthorizedException('Token Expired');
    }
    if (changePasswordDto.token !== user.passwordResetToken) {
      throw new UnauthorizedException('Invalid Token');
    }

    // const hashedPass = await bcrypt.hash(
    //   changePasswordDto.password,
    //   BCRYPT_HASH_ROUND,
    // );
    user.password = changePasswordDto.password;
    user.passwordResetToken = null;
    user.passwordResetTTL = null;
    await user.save();
    return user;
  }
}
