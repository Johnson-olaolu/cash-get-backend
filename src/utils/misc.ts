import * as moment from 'moment';
import * as uniqid from 'uniqid';

export function generateReference(userName?: string) {
  const presentDate = moment().format('YYYYMMDD');
  const paymentReference = uniqid(
    `${(userName.trim().replace(' ', '') || 'CASH_GET').toUpperCase()}-`,
    `-${presentDate}`,
  );
  return paymentReference;
}
