import { CreateUserDto } from 'src/user/dto/create-user.dto';
export const BCRYPT_HASH_ROUND = 5;
export enum UserRolesEnum {
  SUPER_ADMIN = 'SUPER_ADMIN',
  AGENT = 'AGENT',
  STORE_MANAGER = 'STORE_MANAGER',
  BRM_MANAGER = 'BRM_MANAGER',
  STORE_LOCATION_MANAGER = 'STORE_LOCATION_MANAGER',
}

export enum StoreTypeEnum {
  STORE = 'STORE',
  BRM = 'BRM',
}

export enum TokenStatusEnum {
  ACTIVE = 'ACTIVE',
  USED = 'USED',
  CLOSED = 'CLOSED',
}

export const superAdminDetails: CreateUserDto = {
  email: 'johnsonolaolu@gmail.com',
  firstName: 'Super',
  lastName: 'Admin',
  password: 'Kastroud_19',
  phoneNo: '+2347053332295',
  //   role: UserRolesEnum.SUPER_ADMIN,
  userName: 'superAdmin',
};

export enum AppNotificationEnum {
  CREATED = 'CREATED',
  SEEN = 'SEEN',
}

export enum TransactionTypeEnum {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
}

export enum TransactionStatusEnum {
  INITIATED = 'INITIATED',
  CONFIRMED = 'CONFIRMED',
}

export enum WalletTransactionActionEnum {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  TRANSFER = 'TRANSFER',
  RECIEVE = 'RECIEVE',
  PAYMENT = 'PAYMENT',
}

export enum CloudinaryFoldersEnum {
  STORE_PROFILE = 'store-profile',
  AGENT_PROFILE = 'agent-profile',
}

export enum TransactionActionEnum {
  MONNIFY_DEBIT = ' MONNIFY_DEBIT',
  MONNIFY_CREDIT = 'MONNIFY_CREDIT',
  ESCROW_CREDIT = 'ESCROW_CREDIT',
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

export enum OrderStatusesEnum {
  INITIATED = 'INITIATED',
  PAID = 'PAID',
  ACCEPTED = 'ACCEPTED',
  PROCESSING = 'PROCESSING',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELED',
  FAILED = 'FAILED',
}
