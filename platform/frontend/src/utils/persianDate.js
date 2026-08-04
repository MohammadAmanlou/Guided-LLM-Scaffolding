import dayjs from 'dayjs';
import jalaliday from 'jalaliday';
import 'dayjs/locale/fa';

dayjs.extend(jalaliday);
dayjs.locale('fa');

export const toPersianDate = (isoDate) => {
  return dayjs(isoDate)
    .calendar('jalali')
    .locale('fa')
    .format('dddd jD jMMMM jYYYY - HH:mm');
};

export const toPersianNumber = (input) => {
  return String(input).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
};

export function convertUtcToJalali(utcDateString) {
  const date = new Date(utcDateString);
  const options = {
    calendar: 'persian',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Tehran'
  };
  const jalaliDate = new Intl.DateTimeFormat('fa-IR-u-ca-persian', options).format(date);
  return jalaliDate;
}
