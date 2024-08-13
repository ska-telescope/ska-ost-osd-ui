import moment from 'moment';

// Common URLs
export const SPACER_HEADER = 70;
export const SPACER_FOOTER = 70;
export const DATA_STORE_BOX_HEIGHT = 70;
export const SPACER = 50;
export const CHARACTER_LIMIT = 1000;
export const COMMENT_PADDING = 10;
export const DEFAULT_TIME = '---------------------------';

export const fucreatedBeforeDatellHeight = () =>
  `calc(100vh - ${SPACER_HEADER + SPACER_FOOTER + SPACER}px)`;
export const tableHeight = () =>
  `calc(100vh - ${SPACER_HEADER + SPACER_FOOTER + DATA_STORE_BOX_HEIGHT + SPACER}px)`;

  export const SEARCH_TYPE = {
    last7days: 'last 7 days',
    today: 'today',
    dates: 'dates',
    id: 'id'
  }

  export const nextdate = moment()
  .utc()
  .add(1, 'days')
  .toISOString()
  .substring(0, 10);

export const ENTITY = {
  shift: 'shift',
  shiftHistory: 'history',
  shiftLog: 'log',
};

export const ENTITY_ID = {
  shift: 'shift_id',
  today: 'today',
};

export const makeUrlPath = (urlPath: string, createdBefore: string, createdAfter: string) => {
  const baseURL = `${urlPath}?shift_start=${createdBefore}&shift_end=${createdAfter}`;

  return baseURL;
};

export const today = moment().utc().toISOString().substring(0, 10);
export const createdAfterDate = moment().utc().subtract(7, 'days').toISOString().substring(0, 10);
export const createdBeforeDate = moment().utc().toISOString().substring(0, 10);

interface OperatorName {
  label: string;
  value: string;
}

export const operatorName: OperatorName[] = [
  { label: 'Chandler Bing', value: 'Chandler Bing' },
  { label: 'Jake Peralta', value: 'Jake Peralta' },
  { label: 'Ross Geller', value: 'Ross Geller' },
  { label: 'Monica Geller', value: 'Monica Geller' },
  { label: 'Carl Sagan', value: 'Carl Sagan' },
  { label: 'Brian Greene', value: 'Brian Greene' },
  { label: 'Brian Cox', value: 'Brian Cox' },
  { label: 'Jenna Levin', value: 'Jenna Levin' },
  { label: 'Neil Degrass Tyson', value: 'Neil Degrass Tyson' },
];
