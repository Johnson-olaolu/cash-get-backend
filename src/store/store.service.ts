import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Store, StoreDocument } from './schemas/store.schema';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { WalletService } from 'src/wallet/wallet.service';
import { CloudinaryService } from 'src/services/cloudinary/cloudinary.service';
import { CloudinaryFoldersEnum } from 'src/utils/constants';

@Injectable()
export class StoreService {
  constructor(
    private walletService: WalletService,
    @InjectModel(Store.name) private storeModel: Model<Store>,
    private userService: UserService,
    private cloudinaryService: CloudinaryService,
  ) {}
  async createStore(createStoreDto: CreateStoreDto) {
    const coordinator = await this.userService.createStoreManager(
      createStoreDto.coordinatorDetails,
    );
    let store: StoreDocument;
    if (createStoreDto.logo) {
      const logoUrl = await this.cloudinaryService.upload(
        createStoreDto.logo,
        CloudinaryFoldersEnum.STORE_PROFILE,
      );
      store = await this.storeModel.create({
        ...createStoreDto,
        coordinator,
        logo: logoUrl,
      });
    } else {
      store = await this.storeModel.create({
        ...createStoreDto,
        coordinator,
      });
    }

    await this.walletService.create(store);
    // store.wallet = wallet;
    // await store.save();
    // send store created notification
    return store;
  }

  findAll() {
    return `This action returns all store`;
  }

  async findOne(id: string) {
    const store = await this.storeModel.findById(id).populate('wallet').exec();
    if (!store) {
      throw new NotFoundException('Wallet not found for this ID');
    }
    return store;
  }

  update(id: number, updateStoreDto: UpdateStoreDto) {
    return `This action updates a #${id} store`;
  }

  remove(id: number) {
    return `This action removes a #${id} store`;
  }
}
