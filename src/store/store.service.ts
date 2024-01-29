import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { InjectModel } from '@nestjs/mongoose';
import * as otpGenerator from 'otp-generator';
import * as moment from 'moment-timezone';
import { Store, StoreDocument } from './schemas/store.schema';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { WalletService } from 'src/wallet/wallet.service';
import { CloudinaryService } from 'src/services/cloudinary/cloudinary.service';
import { CloudinaryFoldersEnum } from 'src/utils/constants';
import { AddMemberDto } from './dto/add-member.dto';
import { StoreRegistrationToken } from './schemas/store-registration-token.schema';
import { StoreLocation } from './schemas/store-location.schema';
import { AddStoreLocationDto } from './dto/add-store-location.dto';
import { UserDocument } from 'src/user/schemas/user.schema';

@Injectable()
export class StoreService {
  constructor(
    private walletService: WalletService,
    @InjectModel(Store.name) private storeModel: Model<Store>,
    @InjectModel(StoreLocation.name)
    private storeLocationModel: Model<StoreLocation>,
    @InjectModel(StoreRegistrationToken.name)
    private storeRegistrationTokenModel: Model<StoreRegistrationToken>,
    private userService: UserService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async createStore(createStoreDto: CreateStoreDto) {
    let store: StoreDocument;
    if (createStoreDto.logo) {
      const logoUrl = await this.cloudinaryService.upload(
        createStoreDto.logo,
        CloudinaryFoldersEnum.STORE_PROFILE,
      );
      store = await this.storeModel.create({
        ...createStoreDto,
        logo: logoUrl,
      });
    } else {
      store = await this.storeModel.create({
        ...createStoreDto,
      });
    }

    const coordinator = await this.userService.createStoreManager(
      createStoreDto.coordinatorDetails,
    );
    store.coordinator = coordinator;
    await store.save();
    await this.walletService.create(store);
    // store.wallet = wallet;
    // await store.save();
    // send store created notification
    return store;
  }

  async generateStoreAdminToken(storeId: string, addMemberDto: AddMemberDto) {
    const store = await this.findOne(storeId);

    const token = otpGenerator.generate(12, {
      digits: true,
      lowerCaseAlphabets: false,
      specialChars: false,
      upperCaseAlphabets: true,
    });
    const expire = moment().add(1, 'day');
    const registrationToken = await this.storeRegistrationTokenModel.create({
      store: store,
      token,
      use: addMemberDto.use,
      tokenTTl: expire,
    });
    //send store admin email
    return registrationToken;
  }

  async addStoreLocation(
    storeId: string,
    addStoreLocationDto: AddStoreLocationDto,
  ) {
    const store = await this.findOne(storeId);
    const storeLocation = await this.storeLocationModel.create({
      store: store,
      ...addStoreLocationDto,
    });

    let coordinator: UserDocument;
    if (addStoreLocationDto.isExternalCoordinator) {
      coordinator = await this.userService.createStoreLocationManager(
        addStoreLocationDto.coordinatorDetails,
      );
    } else {
      coordinator = store.coordinator;
    }
    storeLocation.coordinator = coordinator;
    await storeLocation.save();
    return storeLocation;
  }

  async generateStoreLocationAdminToken(
    storeLocationId: string,
    addMemberDto: AddMemberDto,
  ) {
    const storeLocation = await this.findOneStoreLocation(storeLocationId);

    const token = otpGenerator.generate(12, {
      digits: true,
      lowerCaseAlphabets: false,
      specialChars: false,
      upperCaseAlphabets: true,
    });
    const expire = moment().add(1, 'day');
    const registrationToken = await this.storeRegistrationTokenModel.create({
      storeLocation: storeLocation,
      token,
      use: addMemberDto.use,
      tokenTTl: expire,
    });
    //send store admin email
    return registrationToken;
  }

  findAll() {
    return `This action returns all store`;
  }

  async findOne(id: string) {
    const store = await this.storeModel
      .findById(id)
      .populate(['wallet', 'coordinator'])
      .exec();
    if (!store) {
      throw new NotFoundException('Store not found for this ID');
    }
    return store;
  }

  async findOneStoreLocation(id: string) {
    const storeLocation = await this.storeLocationModel
      .findById(id)
      .populate(['store', 'coordinator'])
      .exec();
    if (!storeLocation) {
      throw new NotFoundException('Store Location not found for this ID');
    }
    return storeLocation;
  }

  update(id: number, updateStoreDto: UpdateStoreDto) {
    return `This action updates a #${id} store`;
  }

  remove(id: number) {
    return `This action removes a #${id} store`;
  }
}
