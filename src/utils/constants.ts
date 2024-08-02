import moment from 'moment';

// Common URLs
export const SPACER_HEADER = 70;
export const SPACER_FOOTER = 70;
export const DATA_STORE_BOX_HEIGHT = 70;
export const SPACER = 50;

export const fucreatedBeforeDatellHeight = () =>
  `calc(100vh - ${SPACER_HEADER + SPACER_FOOTER + SPACER}px)`;
export const tableHeight = () =>
  `calc(100vh - ${SPACER_HEADER + SPACER_FOOTER + DATA_STORE_BOX_HEIGHT + SPACER}px)`;

export const ENTITY = {
  shift: 'shift',
  shiftHistory: 'history',
  shiftLog: 'log'
};

export const ENTITY_ID = {
  shift: 'shift_id'
};

export const SEARCH_TYPE = {
  last7days: 'last 7 days',
  today: 'today',
  dates: 'dates',
  id: 'id'
};

export const makeUrlPath = (
  id: string,
  createdBefore: string,
  createdAfter: string,
  slt_entity: string
) => {
  let baseURL: string;
  if (id && id !== '') {
    baseURL = `${slt_entity}?match_type=contains&entity_id=${id}`;
  } else {
    baseURL = `${slt_entity}?created_before=${createdBefore}&created_after=${createdAfter}`;
  }
  return baseURL;
};

export const today = moment().utc().toISOString().substring(0, 10);
export const nextdate = moment().utc().add(1, 'days').toISOString().substring(0, 10);
export const createdAfterDate = moment().utc().subtract(7, 'days').toISOString().substring(0, 10);
export const createdBeforeDate = moment().utc().toISOString().substring(0, 10);

export const last7days = {
  createdBefore: createdBeforeDate,
  createdAfter: createdAfterDate
};

interface OperatorName {
  label: string;
  value: string;
}

export const operatorName: OperatorName[] = [
  { label: 'Chandler Bing', value: 'Chandler Bing' },
  { label: 'Jake Peralta', value: 'Jake Peralta' },
  { label: 'Ross Geller', value: 'Ross Geller' },
  { label: 'Monica Geller', value: 'Monica Geller' }
];
