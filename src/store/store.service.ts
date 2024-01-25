import { Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Store } from './schemas/store.schema';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { WalletService } from 'src/wallet/wallet.service';

@Injectable()
export class StoreService {
  constructor(
    private walletService: WalletService,
    @InjectModel(Store.name) private storeModel: Model<Store>,
    private userService: UserService,
  ) {}
  async createStore(createStoreDto: CreateStoreDto) {
    const coordinator = await this.userService.createStoreManager(
      createStoreDto.coordinatorDetails,
    );
    const store = await this.storeModel.create({
      ...createStoreDto,
      coordinator,
    });
    await this.walletService.create(store);
    // send store created notification
    return store;
  }

  findAll() {
    return `This action returns all store`;
  }

  findOne(id: string) {
    return `This action returns a #${id} store`;
  }

  update(id: number, updateStoreDto: UpdateStoreDto) {
    return `This action updates a #${id} store`;
  }

  remove(id: number) {
    return `This action removes a #${id} store`;
  }
}
