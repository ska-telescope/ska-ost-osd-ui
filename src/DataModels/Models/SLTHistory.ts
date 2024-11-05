interface ShiftOperator {
  name: string;
}

export default interface SltHistoryDataModel {
  annotations: string;
  comments: string;
  created_by: string | null;
  created_time: string;
  id: number;
  last_modified_by: string | null;
  last_modified_time: string | null;
  media: string | null;
  shift_end: string | null;
  shift_id: string;
  shift_logs: string | null;
  shift_operator: ShiftOperator;
  shift_start: string;
}
