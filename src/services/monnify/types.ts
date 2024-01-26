export enum MonnifyTransactionStatuses {
  PAID = 'PAID',
  OVERPAID = 'OVERPAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PENDING = 'PENDING',
  ABANDONED = 'ABANDONED',
  CANCELLED = 'CANCELED',
  FAILED = 'FAILED',
  REVERSED = 'REVERSED',
  EXPIRED = 'EXPIRED',
}

export interface IInitiateCreditResponse {
  transactionReference: string;
  paymentReference: string;
  merchantName: string;
  apiKey: string;
  enabledPaymentMethod: string[];
  checkoutUrl: string;
}

export interface IConfirmCreditResponse {
  transactionReference: string;
  paymentReference: string;
  amountPaid: string;
  totalPayable: string;
  settlementAmount: string;
  paidOn: Date;
  paymentStatus: MonnifyTransactionStatuses;
  paymentDescription: string;
  currency: string;
  paymentMethod: string;
  product: {
    type: string;
    reference: string;
  };
  cardDetails: {
    cardType: string;
    last4: string;
    expMonth: string;
    expYear: string;
    bin: string;
    bankCode: string;
    bankName: string;
    reusable: boolean;
    countryCode: string;
    cardToken: string;
    supportsTokenization: boolean;
    maskedPan: string;
  };
  accountDetails: any;
  accountPayments: any[];
  customer: { email: string; name: string };
  metaData: Record<string, unknown>;
}

export interface IConfirmDisbursementResponse {
  amount: number;
  reference: string;
  status: string;
  dateCreated: string;
  totalFee: number;
  sessionId: string;
  destinationAccountName: string;
  destinationBankName: string;
  destinationAccountNumber: string;
  destinationBankCode: string;
}
