import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { AddStoreLocationDto } from './dto/add-store-location.dto';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  create(@Body() createStoreDto: CreateStoreDto) {
    return this.storeService.createStore(createStoreDto);
  }

  @Get()
  findAll() {
    return this.storeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storeService.update(+id, updateStoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storeService.remove(+id);
  }

  @Post(':id/admin')
  async registerStoreAdmin(
    @Param('id') storeId: string,
    @Body() addMemberDto: AddMemberDto,
  ) {
    const data = await this.storeService.generateStoreAdminToken(
      storeId,
      addMemberDto,
    );
    return {
      success: true,
      message: 'Store Admin  registration token created successfully',
      data: data,
    };
  }

  @Post(':id/location')
  async addStoreLocation(
    @Param('id') storeId: string,
    @Body() addStoreLocationDto: AddStoreLocationDto,
  ) {
    const data = await this.storeService.addStoreLocation(
      storeId,
      addStoreLocationDto,
    );
    return {
      success: true,
      message: 'Store Location added successfully',
      data: data,
    };
  }

  @Post(':id/location/:locationId/admin')
  async addStoreLocationAdmin(
    @Param('locationId') storeLocationId: string,
    @Body() addMemberDto: AddMemberDto,
  ) {
    const data = await this.storeService.generateStoreLocationAdminToken(
      storeLocationId,
      addMemberDto,
    );
    return {
      success: true,
      message: 'Store Location Admin registration token created successfully',
      data: data,
    };
  }
}
