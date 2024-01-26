import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Cache } from 'cache-manager';
import {
  IConfirmCreditResponse,
  IConfirmDisbursementResponse,
  IInitiateCreditResponse,
} from './types';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { TransactionActionEnum } from 'src/utils/constants';

@Injectable()
export class MonnifyService {
  private redirectUrl = `${this.configService.get(
    'BASE_URL',
  )}/transaction/confirm-credit`;
  constructor(
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private async generateMonnifyToken(): Promise<string> {
    const clientIDSecretInBase64 = Buffer.from(
      `${this.configService.get('MONNIFY_API_KEY')}:${this.configService.get(
        'MONNIFY_API_SECRET',
      )}`,
      'utf8',
    ).toString('base64');
    const headers = {
      Authorization: `Basic ${clientIDSecretInBase64}`,
      Accept: 'application/json',
      'Accept-Encoding': 'identity',
    };
    const cachedAccessToken = await this.cacheManager.get(
      'MONNIFY_ACCESS_TOKEN',
    );

    if (cachedAccessToken) {
      return cachedAccessToken as any;
    }
    const response = await axios.post(
      `${this.configService.get('MONNIFY_BASE_URL')}/api/v1/auth/login`,
      null,
      {
        timeout: 1000 * 60,
        headers,
      },
    );
    const { responseBody } = response.data;
    const { accessToken, expiresIn } = responseBody;
    await this.cacheManager.set(
      'MONNIFY_ACCESS_TOKEN',
      accessToken,
      expiresIn * 10,
    );

    return accessToken;
  }

  async initiateCreditTransaction(payload: {
    name: string;
    email: string;
    amount: number;
    paymentReference: string;
    paymentDescription: string;
    currency?: string;
  }): Promise<IInitiateCreditResponse> {
    try {
      const transactionPayload = {
        amount: payload.amount,
        customerName: payload.name,
        customerEmail: payload.email,
        paymentReference: payload.paymentReference,
        paymentDescription: payload.paymentDescription,
        currencyCode: payload.currency || 'NGN',
        contractCode: this.configService.get('MONNIFY_CONTRACT_CODE'),
        redirectUrl: this.redirectUrl,
        paymentMethods: ['CARD', 'ACCOUNT_TRANSFER'],
      };
      const token = await this.generateMonnifyToken();

      const headers = {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Accept-Encoding': 'identity',
      };
      const response = await axios.post(
        `${this.configService.get(
          'MONNIFY_BASE_URL',
        )}/api/v1/merchant/transactions/init-transaction`,
        transactionPayload,
        { headers },
      );
      const { responseBody } = response.data;
      return responseBody;
    } catch (error: any) {
      // console.log(error);
      throw new InternalServerErrorException('Encountered an error');
    }
  }

  async confirmCreditTransaction(
    transactionReference: string,
  ): Promise<IConfirmCreditResponse> {
    try {
      const token = await this.generateMonnifyToken();

      const headers = {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Accept-Encoding': 'identity',
      };
      const response = await axios.get(
        `${this.configService.get(
          'MONNIFY_BASE_URL',
        )}/api/v2/transactions/${encodeURIComponent(transactionReference)}`,
        { headers },
      );
      const { responseBody } = response.data;
      return responseBody;
    } catch (error) {
      console.log(error);
    }
  }

  async createCreditTransaction(
    transactionReference: string,
    amount: number,
    payload: {
      destinationBankCode: string;
      destinationAccountNumber: string;
      sourceAccountNumber: string;
      destinationAccountName: string;
      currency: string;
    },
  ): Promise<IConfirmDisbursementResponse> {
    try {
      const transactionPayload = {
        amount: amount,
        reference: transactionReference,
        narration: TransactionActionEnum.MONNIFY_CREDIT,
        destinationBankCode: payload.destinationBankCode,
        destinationAccountNumber: payload.destinationAccountNumber,
        currency: payload.currency,
        sourceAccountNumber: payload.sourceAccountNumber,
        destinationAccountName: payload.destinationAccountName,
      };
      const token = await this.generateMonnifyToken();
      const headers = {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Accept-Encoding': 'identity',
      };
      const response = await axios.post(
        `${this.configService.get(
          'MONNIFY_BASE_URL',
        )}/api/v2/disbursements/single`,
        transactionPayload,
        { headers },
      );
      const { responseBody } = response.data;
      return responseBody;
    } catch (error) {
      console.log(error);
    }
  }
}
