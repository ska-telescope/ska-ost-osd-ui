/* eslint-disable @typescript-eslint/no-explicit-any */
interface Media {
  path: string;
  type: string;
}

interface Metadata {
  created_by: string;
  created_on: string; // ISO 8601 date string
  last_modified_by: string;
  last_modified_on: string; // ISO 8601 date string
  version: number;
}

interface Info {
  eb_id: string;
  interface: string;
  metadata: Metadata;
  request_responses: any;
  sbd_ref: string;
  sbd_version: number;
  sbi_ref: string;
  sbi_status: string;
  telescope: string;
}

interface ShiftLog {
  info: Info;
  log_time: string; // ISO 8601 date string
  source: string;
}

interface ShiftOperator {
  name: string;
}

export default interface ShiftData {
  annotations: string;
  comments: string;
  created_time: string;
  id: number;
  media: Media[];
  shift_end: string;
  shift_id: string;
  shift_logs: ShiftLog[];
  shift_operator: ShiftOperator;
  shift_start: string;
}
