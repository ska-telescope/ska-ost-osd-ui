import moment from 'moment';

export const SPACER = 50;
export const CHARACTER_LIMIT = 1000;
export const DEFAULT_TIME = '---------------------------';

export const SEARCH_TYPE = {
  operator: 'operator',
  today: 'today',
  dates: 'dates',
  status: 'status'
};

export const EBRequestResponseStatus = {
  OK: 'OK'
};

export const ENTITY = {
  shift: 'shift',
  shiftHistory: 'history',
  shiftLog: 'log'
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

const getTodayUTCDateRange = (dateString) => {
  const startDate = moment(dateString, 'YYYY-MM-DD').startOf('day').utc();
  const endDate = moment(dateString, 'YYYY-MM-DD').endOf('day').utc();
  return {
    start: startDate.format(),
    end: endDate.format()
  };
};

export const getUTCDateRange = (start, end) => {
  const startDate = moment(start, 'YYYY-MM-DD').startOf('day').utc();
  const endDate = moment(end, 'YYYY-MM-DD').endOf('day').utc();
  return {
    start: startDate.format(),
    end: endDate.format()
  };
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
