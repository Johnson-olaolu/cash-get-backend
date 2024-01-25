import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpCode,
  ParseFilePipe,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Express } from 'express';
import { AuthService } from './auth.service';
import { UserDocument } from 'src/user/schemas/user.schema';
import { LocalAuthGuard } from './guards/loginGuard.guard';
import { GenerateRegistrationTokenDto } from './dto/generate-registration-token.dto';
import { AuthGuard } from '@nestjs/passport';
import RoleGuard from './guards/roleGuards.guard';
import { UserRolesEnum } from 'src/utils/constants';
import { RegisterAgentDto, RegisterStoreDto } from './dto/register.dto';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async loginUser(@Req() request: Request) {
    const user = (request as any).user as UserDocument;
    const data = await this.authService.loginUser(user);
    return {
      success: true,
      message: 'user logged in successfully',
      data: data,
    };
  }

  @UseGuards(
    RoleGuard([
      UserRolesEnum.SUPER_ADMIN,
      UserRolesEnum.STORE_MANAGER,
      UserRolesEnum.BRM_MANAGER,
    ]),
  )
  @UseGuards(AuthGuard('jwt'))
  @Post('generate-registration-token')
  async generateRegistrationToken(
    @Body() generateRegistrationTokenDto: GenerateRegistrationTokenDto,
  ) {
    const data = await this.authService.generateRegistrationToken(
      generateRegistrationTokenDto,
    );
    return {
      success: true,
      message: 'registration token generated succesffuly successfully',
      data: data,
    };
  }

  @Post('register/agent')
  @UseInterceptors(FileInterceptor('profilePicture'))
  async registerAgent(
    @Body() registerAgentDto: RegisterAgentDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // new MaxFileSizeValidator({ maxSize: 1000 }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    profilePicture: Express.Multer.File,
  ) {
    const data = await this.authService.registerAgent({
      ...registerAgentDto,
      profilePicture,
    });
    return {
      success: true,
      message: 'Agent registered please confirm your email',
      data: data,
    };
  }

  @Post('register/store')
  @UseInterceptors(FileInterceptor('logo'))
  async registerStore(
    @Body() registerStoreDto: RegisterStoreDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // new MaxFileSizeValidator({ maxSize: 1000 }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    logo: Express.Multer.File,
  ) {
    const data = await this.authService.registerStore({
      ...registerStoreDto,
      logo: logo,
    });
    return {
      success: true,
      message: 'Store registered please confirm your email',
      data: data,
    };
  }

  @Post('confirm-email')
  async confirmEmail(@Body() confirmEmailDto: ConfirmEmailDto) {
    const data = await this.authService.confirmUserEmail(
      confirmEmailDto.email,
      confirmEmailDto.token,
    );
    return {
      success: true,
      message: 'Email confirmed successfully',
      data: data,
    };
  }

  @Get('confirm-email')
  async sendConfirmEmail(@Query('email') email: string) {
    const data = await this.authService.sendConfirmEmail(email);
    return {
      success: true,
      message: 'Email confirmed request sent successfully',
      data: data,
    };
  }

  @Get('change-password')
  async sendChangePasswordLink(@Query('email') email: string) {
    const data = await this.authService.getChangePasswordUrl(email);
    return {
      success: true,
      message: 'Password reset link sent successfully',
      data: data,
    };
  }

  @Post('change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    const data = await this.authService.changePassword(changePasswordDto);
    return {
      success: true,
      message: 'Password changed successfully',
      data: data,
    };
  }
}
