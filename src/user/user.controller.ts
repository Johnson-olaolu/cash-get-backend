import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserDocument } from './schemas/user.schema';

@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createAgent(@Body() createUserDto: CreateUserDto) {
    return this.userService.createAgent(createUserDto);
  }

  @Get('me')
  getUser(@Req() req: Request) {
    const user = (req as any).user as UserDocument;
    return this.userService.fetchDetails(user._id as any);
  }

  @Post('update-profile-picture/:id')
  async updateProfilePicture(
    @Param('id') id: string,
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
    const data = await this.userService.updateProfileImage(id, profilePicture);
    return {
      success: true,
      message: 'Profile image updated successfully',
      data: data,
    };
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
