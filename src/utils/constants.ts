import moment from 'moment';

export const SPACER = 50;
export const CHARACTER_LIMIT = 1000;
export const DEFAULT_TIME = '---------------------------';

export const SEARCH_TYPE = {
  operator: 'operator',
  today: 'today',
  dates: 'dates',
  status: 'status',
  eb_id: 'eb_id',
  sbi_id: 'sbi_id'
};
export const SHIFT_STATUS = {
  START: 'START',
  END: 'END',
  YES: 'YES'
};

export const EBRequestResponseStatus = {
  OK: 'OK'
};

export const KafkaTopic = {
  serviceToUITopic: 'slt-to-frontend-topic'
};

export const ENTITY = {
  shift: 'shift',
  shiftHistory: 'history',
  shiftLog: 'log'
};

export const getUrlPath = (data) => {
  if (data.status) {
    const baseURL = `shifts?sbi_status=${data.status}&match_type=contains`;
    return baseURL;
  }
  if (data.shift_operator) {
    const baseURL = `shifts?shift_operator=${data.shift_operator}&match_type=contains`;
    return baseURL;
  }
  if (data.createdAfter && data.createdBefore) {
    const baseURL = `shifts?shift_start=${data.createdAfter}&shift_end=${data.createdBefore}&query_type=created_between`;
    return baseURL;
  }
  if (data.eb_id) {
    const baseURL = `shifts?match_type=contains&eb_id=${data.eb_id}`;
    return baseURL;
  }
  if (data.sbi_id) {
    const baseURL = `shifts?match_type=contains&sbi_id=${data.sbi_id}`;
    return baseURL;
  }
  return '';
};

const getTodayUTCDateRange = (dateString) => {
  const startDate = moment(dateString).startOf('day').utc().format('YYYY-MM-DD HH:mm:ss.SSSSSS');
  const endDate = moment(dateString).endOf('day').utc().format('YYYY-MM-DD HH:mm:ss.SSSSSS');
  return {
    start: startDate,
    end: endDate
  };
};

export const getUTCDateRange = (start, end) => {
  const startDate = moment(start).startOf('day').utc().format('YYYY-MM-DD HH:mm:ss.SSSSSS');
  const endDate = moment(end).endOf('day').utc().format('YYYY-MM-DD HH:mm:ss.SSSSSS');
  return {
    start: startDate,
    end: endDate
  };
};

export const SHIFT_END = {
  END_TIME: moment().utc().format('YYYY-MM-DD HH:mm:ss.SSSSSS')
};

export const getFormatedDate = (date) => {
  const formatedDate = moment(date).utc().format('YYYY-MM-DD');
  return formatedDate;
};

export const todayDate = moment().utc().toISOString().substring(0, 10);
export const getTodayDateRange = getTodayUTCDateRange(
  moment().utc().toISOString().substring(0, 10)
);

interface LogSearchType {
  label: string;
  value: string;
}

export const operatorName = ['DefaultUser', 'TestUser'];
export const ebId = ['DefaultUser', 'TestUser', 'Test data'];

export const logTypeEnum = {
  searchByDate: 'searchByDate',
  searchByOperator: 'searchByOperator',
  searchByStatus: 'searchByStatus',
  searchByEbId: 'searchByEbId',
  searchBySbiId: 'searchBySbiId'
};

export const logSearchType: LogSearchType[] = [
  { label: 'Search by dates', value: 'searchByDate' },
  { label: 'Search by operator', value: 'searchByOperator' },
  { label: 'Search by status', value: 'searchByStatus' },
  { label: 'Search by eb id', value: 'searchByEbId' },
  { label: 'Search by sbi id', value: 'searchBySbiId' }
];

export const SBIStatus = ['Created', 'Executing', 'Observed', 'Failed'];

export const toUTCDateTimeFormat = (value: string) =>
  moment(value).utc().format('DD-MM-YYYY HH:mm:ss');
