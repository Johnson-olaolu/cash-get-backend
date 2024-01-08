import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDocument } from 'src/user/schemas/user.schema';
import { LocalAuthGuard } from './guards/loginGuard.guard';
import { GenerateRegistrationTokenDto } from './dto/generate-registration-token.dto';
import { AuthGuard } from '@nestjs/passport';
import RoleGuard from './guards/roleGuards.guard';
import { UserRolesEnum } from 'src/utils/constants';
import { RegisterAgentDto } from './dto/register.dto';

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
  async registerAgent(@Body() registerAgentDto: RegisterAgentDto) {
    const data = await this.authService.registerAgent(registerAgentDto);
    return {
      success: true,
      message: 'Agent registered please confirm your email',
      data: data,
    };
  }
}
