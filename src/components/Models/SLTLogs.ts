interface Media {
  type: string;
  path: string;
}

interface ShiftLogs {
  Info: JSON;
  media: Media;
  logtime: Date;
}

export default interface SLTLogDataModel {
  id: number;
  shift_id: string;
  shift_operator: string;
  comments: string;
  annotation: string;
  created_by: string;
  last_modified_by: string;
  shift_start: Date;
  shift_end: Date;
  created_time: Date;
  last_modified_time: Date;
  logs: ShiftLogs;
  source: string;
  media: Media;
}
