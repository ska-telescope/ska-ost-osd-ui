export interface JsonObject {
  [key: string]: JsonValue;
}

export type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];

export interface ReceiverInfo {
  max_frequency_hz: number;
  min_frequency_hz: number;
  rx_id: string;
}

export interface ReceiverInformation {
  receiver_information: ReceiverInfo[];
}
