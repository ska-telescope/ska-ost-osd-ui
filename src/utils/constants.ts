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
};

export const ENTITY_ID = {
  shift: 'shift_id',

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

export const today = moment()
  .utc()
  .toISOString()
  .substring(0, 10);
export const nextdate = moment()
  .utc()
  .add(1, 'days')
  .toISOString()
  .substring(0, 10);
export const createdAfterDate = moment()
  .utc()
  .subtract(7, 'days')
  .toISOString()
  .substring(0, 10);
export const createdBeforeDate = moment()
  .utc()
  .toISOString()
  .substring(0, 10);

export const last7days = {
  createdBefore: createdBeforeDate,
  createdAfter: createdAfterDate
};


export const SBIStatus = [
  { label: 'Created', value: 'created' },
  { label: 'Executing', value: 'executing' },
  { label: 'Observed', value: 'observed' },
  { label: 'Failed', value: 'failed' }
];


export const getStatusValue = (key: string): string | undefined => {
  const MergedStatus = [...SBIStatus];
  const status = MergedStatus.find(item => item.value === key);
  return status ? status.value : 'NA';
};
