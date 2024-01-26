import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreditWalletDto } from './dto/credit-wallet.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get(':id')
  async fetchWallet(@Param('id') id: string) {
    const data = await this.walletService.findOne(id);
    return {
      success: true,
      message: 'Wallet fetched succcesfully',
      data,
    };
  }

  @Get('store/:storeId')
  async fetchStoreWallet(@Param('storeId') storeId: string) {
    const data = await this.walletService.fetchStoreWallet(storeId);
    return {
      success: true,
      message: 'Store Wallet fetched succcesfully',
      data,
    };
  }

  @Post(':id/credit')
  async creditWallet(
    @Param('id') walletId: string,
    @Body() creditWalletDto: CreditWalletDto,
  ) {
    const data = await this.walletService.initiateCreditWallet(
      walletId,
      creditWalletDto,
    );
    return {
      success: true,
      message: 'Credit Wallet Initiated',
      data,
    };
  }
}
