import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserDocument } from 'src/user/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as otpGenerator from 'otp-generator';
import * as moment from 'moment-timezone';
import { UserService } from 'src/user/user.service';
import { GenerateRegistrationTokenDto } from './dto/generate-registration-token.dto';
import { RegistrationToken } from './schemas/RegistrationToken.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterAgentDto, RegisterStoreDto } from './dto/register.dto';
import { StoreService } from 'src/store/store.service';
import { TokenStatusEnum, UserRolesEnum } from 'src/utils/constants';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private storeService: StoreService,
    // private notificationService: NotificationService,
    @InjectModel(RegistrationToken.name)
    private registrationTokenModel: Model<RegistrationToken>,
  ) {}

  async registerAgent(registerAgentDto: RegisterAgentDto) {
    const registrationToken = await this.validateRegistrationToken(
      registerAgentDto.registrationToken,
      UserRolesEnum.AGENT,
    );
    const agent = await this.userService.createAgent(registerAgentDto);
    registrationToken.registered = agent._id as any;
    registrationToken.status = TokenStatusEnum.USED;
    await registrationToken.save();
    return agent;
  }

  registerBRM() {}

  async registerStore(registerShopDto: RegisterStoreDto) {
    const registrationToken = await this.validateRegistrationToken(
      registerShopDto.registrationToken,
      UserRolesEnum.STORE_MANAGER,
    );
    const store = await this.storeService.createStore(registerShopDto);
    registrationToken.registered = store._id as any;
    await registrationToken.save();
    return store;
  }

  async validateRegistrationToken(token: string, use: UserRolesEnum) {
    const registrationToken = await this.registrationTokenModel.findOne({
      token: token,
    });

    if (!registrationToken) {
      throw new UnauthorizedException('Invalid Token');
    }
    if (registrationToken.use !== use) {
      throw new UnauthorizedException('Invalid Token');
    }
    const currentDate = moment(moment.now()).toDate().valueOf();

    if (currentDate > moment(registrationToken.tokenTTl).toDate().valueOf()) {
      registrationToken.status = TokenStatusEnum.CLOSED;
      await registrationToken.save();
      throw new UnauthorizedException('Token Expired');
    }
    return registrationToken;
  }

  loginUser(user: UserDocument) {
    const payload = { username: user.email, sub: user._id };
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken: accessToken,
      user: user,
    };
  }

  async generateRegistrationToken(
    generateRegistrationTokenDto: GenerateRegistrationTokenDto,
  ) {
    const user = await this.userService.findOne(
      generateRegistrationTokenDto.userId,
    );
    const token = otpGenerator.generate(12, {
      digits: true,
      lowerCaseAlphabets: false,
      specialChars: false,
      upperCaseAlphabets: true,
    });
    const expire = moment().add(1, 'day');
    const newRegistrationToken = await this.registrationTokenModel.create({
      user,
      token,
      use: generateRegistrationTokenDto.use,
      tokenTTl: expire,
    });
    return newRegistrationToken;
  }

  async getAuthenticatedUser(usernameOrEmail: string, password: string) {
    const user =
      await this.userService.findOneByEmailOrUserName(usernameOrEmail);
    const result = await bcrypt.compareSync(password, user.password);
    if (!result) {
      throw new BadRequestException('Wrong details provided');
    }
    return user;
  }

  async getUser(emailOrUserName: string) {
    const user =
      await this.userService.findOneByEmailOrUserName(emailOrUserName);
    return user;
  }
}
