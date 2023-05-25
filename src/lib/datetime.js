import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const datetime = {
  format: (string) => dayjs(string).format('MMMM Do YYYY, h:mm:ss a'),
  toNow: (string) => dayjs(string).toNow(true),
};

export default datetime;
