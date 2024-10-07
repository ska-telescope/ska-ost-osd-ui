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
  operator: 'operator',
  today: 'today',
  dates: 'dates',
  status: 'status'
};

export const nextdate = moment().utc().add(1, 'days').toISOString().substring(0, 10);

export const ENTITY = {
  shift: 'shift',
  shiftHistory: 'history',
  shiftLog: 'log'
};

export const ENTITY_ID = {
  shift: 'shift_id',
  today: 'today'
};

export const makeUrlPath = (urlPath: string, createdBefore: string, createdAfter: string) => {
  const baseURL = `${urlPath}?shift_start=${createdBefore}&shift_end=${createdAfter}`;

  return baseURL;
};

export const getUrlPath = (data) => {
  if (data.status) {
    const baseURL = `shift/shifts?status=${data.status}&match_type=contains`;
    return baseURL;
  }
  if (data.shift_operator) {
    const baseURL = `shift/shifts?shift_operator=${data.shift_operator}&match_type=contains`;
    return baseURL;
  }
  if (data.createdAfter && data.createdBefore) {
    const baseURL = `shift/shifts?shift_start=${data.createdAfter}&shift_end=${data.createdBefore}&query_type=created_between`;
    return baseURL;
  }
  return '';
};

export const today = moment().utc().toISOString().substring(0, 10);
export const createdAfterDate = moment().utc().subtract(1, 'days').toISOString().substring(0, 10);
export const createdBeforeDate = moment().utc().toISOString().substring(0, 10);

interface LogSearchType {
  label: string;
  value: string;
}

export const operatorName = ['DefaultUser', 'TestUser'];
export const logTypeEnum = {
  searchByDate: 'searchByDate',
  searchByOperator: 'searchByOperator',
  searchByStatus: 'searchByStatus'
};

export const logSearchType: LogSearchType[] = [
  { label: 'Search by dates', value: 'searchByDate' },
  { label: 'Search by operator', value: 'searchByOperator' },
  { label: 'Search by status', value: 'searchByStatus' }
];

export const SBIStatus = ['Created', 'Executing', 'Observed', 'Failed'];
