const SHIFT_DATA_LIST = [
  {
    shift_id: 'shift-20241108-c9a3',
    shift_start: '2024-10-22T11:24:04.389077Z',
    shift_end: '2024-10-22T11:24:04.389077Z',
    annotations: 'This is test annotation',
    shift_operator: 'TestUser',
    comments: [
      {
        id: 1,
        comment: 'This is shift comment one',
        shift_id: 'shift-20241104-0701',
        created_on: '2024-10-22T11:24:04.389077Z'
      },
      {
        id: 2,
        comment: 'This is shift comment two',
        shift_id: 'shift-20241104-0701',
        created_on: '2024-10-22T11:24:04.389077Z'
      }
    ],
    shift_logs: [
      {
        info: {
          eb_id: 'eb-t0001-20241022-000066',
          sbd_ref: 'sbd-t0001-20240822-00008',
          sbi_ref: 'sbi-t0001-20240822-00009',
          metadata: {
            version: 1,
            created_by: 'DefaultUser',
            created_on: '2024-10-22T11:25:36.953526Z',
            pdm_version: '15.4.0',
            last_modified_by: 'DefaultUser',
            last_modified_on: '2024-10-22T11:25:36.953526Z'
          },
          interface: 'https://schema.skao.int/ska-oso-pdm-eb/0.1',
          telescope: 'ska_mid',
          sbi_status: 'failed',
          sbd_version: 1,
          request_responses: [
            {
              status: 'OK',
              request: 'ska_oso_scripting.functions.devicecontrol.assign_resource',
              response: {
                result: 'this is a result'
              },
              request_args: {
                kwargs: {
                  subarray_id: '1'
                }
              },
              request_sent_at: '2022-09-23T15:43:53.971548Z',
              response_received_at: '2022-09-23T15:43:53.971548Z'
            },
            {
              status: 'OK',
              request: 'ska_oso_scripting.functions.devicecontrol.configure_resource',
              response: {
                result: 'this is a result'
              },
              request_args: {
                kwargs: {
                  subarray_id: '1'
                }
              },
              request_sent_at: '2022-09-23T15:43:53.971548Z',
              response_received_at: '2022-09-23T15:43:53.971548Z'
            },
            {
              request: 'ska_oso_scripting.functions.devicecontrol.scan',
              error: {
                detail: 'this is an error'
              },
              status: 'ERROR'
            }
          ]
        },
        source: 'ODA',
        log_time: '2024-10-22T11:24:14.406107Z',
        comments: [
          {
            id: 1,
            log_comment: 'This is log comment one',
            operator_name: 'john',
            shift_id: 'shift-e71a091c-0841-47f0-9f57-8ee97c08bb77',
            image: {
              path: 'https://skao-611985328822-shift-log-tool-storage.s3.amazonaws.com/c5f3f901-bc62-41a2-8640-4325e8e5e3c0.png',
              timestamp: '2024-11-04T06:50:24.095341Z'
            },
            eb_id: 'eb-t0001-20241022-00004'
          },
          {
            id: 2,
            log_comment: 'This is log comment two',
            operator_name: 'peter',
            shift_id: 'shift-e71a091c-0841-47f0-9f57-8ee97c08bb77',
            eb_id: 'eb-t0001-20241022-00008'
          }
        ]
      },
      {
        info: {
          eb_id: 'eb-t0001-20241022-000066',
          sbd_ref: 'sbd-t0001-20240822-00008',
          sbi_ref: 'sbi-t0001-20240822-00009',
          metadata: {
            version: 1,
            created_by: 'DefaultUser',
            created_on: '2024-10-22T11:25:36.953526Z',
            pdm_version: '15.4.0',
            last_modified_by: 'DefaultUser',
            last_modified_on: '2024-10-22T11:25:36.953526Z'
          },
          interface: 'https://schema.skao.int/ska-oso-pdm-eb/0.1',
          telescope: 'ska_mid',
          sbi_status: 'failed',
          sbd_version: 1,
          request_responses: [
            {
              status: 'OK',
              request: 'ska_oso_scripting.functions.devicecontrol.assign_resource',
              response: {
                result: 'this is a result'
              },
              request_args: {
                kwargs: {
                  subarray_id: '1'
                }
              },
              request_sent_at: '2022-09-23T15:43:53.971548Z',
              response_received_at: '2022-09-23T15:43:53.971548Z'
            },
            {
              status: 'OK',
              request: 'ska_oso_scripting.functions.devicecontrol.configure_resource',
              response: {
                result: 'this is a result'
              },
              request_args: {
                kwargs: {
                  subarray_id: '1'
                }
              },
              request_sent_at: '2022-09-23T15:43:53.971548Z',
              response_received_at: '2022-09-23T15:43:53.971548Z'
            },
            {
              status: 'OK',
              request: 'ska_oso_scripting.functions.devicecontrol.scan',
              response: {
                result: 'this is a result'
              },
              request_args: {
                kwargs: {
                  subarray_id: '1'
                }
              },
              request_sent_at: '2022-09-23T15:43:53.971548Z',
              response_received_at: '2022-09-23T15:43:53.971548Z'
            },
            {
              status: 'OK',
              request: 'ska_oso_scripting.functions.devicecontrol.release_all_resources',
              response: {
                result: 'this is a result'
              },
              request_args: {
                kwargs: {
                  subarray_id: '1'
                }
              },
              request_sent_at: '2022-09-23T15:43:53.971548Z',
              response_received_at: '2022-09-23T15:43:53.971548Z'
            },
            {
              error: {
                detail: 'this is an error'
              },
              status: 'ERROR',
              request: 'ska_oso_scripting.functions.devicecontrol.end',
              request_sent_at: '2022-09-23T15:43:53.971548Z'
            }
          ]
        },
        source: 'ODA',
        log_time: '2024-10-22T11:24:14.406107Z',
        comments: [
          {
            id: 3,
            log_comment: 'updated nov4 comment',
            operator_name: 'john',
            shift_id: 'shift-e71a091c-0841-47f0-9f57-8ee97c08bb77',
            image: {
              path: 'https://skao-611985328822-shift-log-tool-storage.s3.amazonaws.com/c5f3f901-bc62-41a2-8640-4325e8e5e3c0.png',
              timestamp: '2024-11-04T06:50:24.095341Z'
            },
            eb_id: 'eb-t0001-20241022-00004'
          },
          {
            id: 4,
            log_comment: 'this is comment',
            operator_name: 'peter',
            shift_id: 'shift-e71a091c-0841-47f0-9f57-8ee97c08bb77',
            eb_id: 'eb-t0001-20241022-00008'
          }
        ]
      },
      {
        info: {
          eb_id: 'eb-t0001-20241022-000066',
          sbd_ref: 'sbd-t0001-20240822-00008',
          sbi_ref: 'sbi-t0001-20240822-00009',
          metadata: {
            version: 1,
            created_by: 'DefaultUser',
            created_on: '2024-10-22T11:25:36.953526Z',
            pdm_version: '15.4.0',
            last_modified_by: 'DefaultUser',
            last_modified_on: '2024-10-22T11:25:36.953526Z'
          },
          interface: 'https://schema.skao.int/ska-oso-pdm-eb/0.1',
          telescope: 'ska_mid',
          sbi_status: 'failed',
          sbd_version: 1,
          request_responses: [
            {
              status: 'OK',
              request: 'ska_oso_scripting.functions.devicecontrol.assign_resource',
              response: {
                result: 'this is a result'
              },
              request_args: {
                kwargs: {
                  subarray_id: '1'
                }
              },
              request_sent_at: '2022-09-23T15:43:53.971548Z',
              response_received_at: '2022-09-23T15:43:53.971548Z'
            },
            {
              status: 'OK',
              request: 'ska_oso_scripting.functions.devicecontrol.configure_resource',
              response: {
                result: 'this is a result'
              },
              request_args: {
                kwargs: {
                  subarray_id: '1'
                }
              },
              request_sent_at: '2022-09-23T15:43:53.971548Z',
              response_received_at: '2022-09-23T15:43:53.971548Z'
            },
            {
              status: 'OK',
              request: 'ska_oso_scripting.functions.devicecontrol.scan',
              response: {
                result: 'this is a result'
              },
              request_args: {
                kwargs: {
                  subarray_id: '1'
                }
              },
              request_sent_at: '2022-09-23T15:43:53.971548Z',
              response_received_at: '2022-09-23T15:43:53.971548Z'
            },
            {
              status: 'OK',
              request: 'ska_oso_scripting.functions.devicecontrol.release_all_resources',
              response: {
                result: 'this is a result'
              },
              request_args: {
                kwargs: {
                  subarray_id: '1'
                }
              },
              request_sent_at: '2022-09-23T15:43:53.971548Z',
              response_received_at: '2022-09-23T15:43:53.971548Z'
            },
            {
              error: {
                detail: 'this is an error'
              },
              status: 'ERROR',
              request: 'ska_oso_scripting.functions.devicecontrol.end',
              request_sent_at: '2022-09-23T15:43:53.971548Z'
            }
          ]
        },
        source: 'ODA',
        log_time: '2024-10-22T11:24:14.406107Z',
        comments: [
          {
            id: 5,
            log_comment: 'updated nov4 comment',
            operator_name: 'john',
            shift_id: 'shift-e71a091c-0841-47f0-9f57-8ee97c08bb77',
            image: {
              path: 'https://skao-611985328822-shift-log-tool-storage.s3.amazonaws.com/c5f3f901-bc62-41a2-8640-4325e8e5e3c0.png',
              timestamp: '2024-11-04T06:50:24.095341Z'
            },
            eb_id: 'eb-t0001-20241022-00004'
          },
          {
            id: 6,
            log_comment: 'this is comment',
            operator_name: 'peter',
            shift_id: 'shift-e71a091c-0841-47f0-9f57-8ee97c08bb77',
            eb_id: 'eb-t0001-20241022-00008'
          }
        ]
      }
    ],
    metadata: {
      created_by: 'john',
      created_on: '2024-10-22T11:24:04.388998Z',
      last_modified_by: 'john',
      last_modified_on: '2024-10-22T11:25:36.971764Z'
    }
  },

  {
    shift_id: 'shift-e71a091c-0841-47f0-9f57-8ee97c08bb77',
    shift_start: '2024-10-22T11:24:04.389077Z',
    shift_operator: 'john',
    comments: [
      {
        comment: 'updated comment',
        shift_id: 'shift-20241104-0701'
      },
      {
        comment: '"This is a comment 3 updated...."',
        shift_id: 'shift-20241104-0701'
      },
      {
        comment: '"This is a comment 2 updated...."',
        shift_id: 'shift-20241104-0701'
      }
    ],
    shift_logs: [
      {
        info: {
          eb_id: 'eb-t0001-20241022-00002',
          sbd_ref: 'sbd-t0001-20240822-00008',
          sbi_ref: 'sbi-t0001-20240822-00009',
          metadata: {
            version: 1,
            created_by: 'DefaultUser',
            created_on: '2024-10-22T11:25:36.953526Z',
            pdm_version: '15.4.0',
            last_modified_by: 'DefaultUser',
            last_modified_on: '2024-10-22T11:25:36.953526Z'
          },
          interface: 'https://schema.skao.int/ska-oso-pdm-eb/0.1',
          telescope: 'ska_mid',
          sbi_status: 'failed',
          sbd_version: 1,
          request_responses: [
            {
              status: 'OK',
              request: 'ska_oso_scripting.functions.devicecontrol.assign_resource',
              response: {
                result: 'this is a result'
              },
              request_args: {
                kwargs: {
                  subarray_id: '1'
                }
              },
              request_sent_at: '2022-09-23T15:43:53.971548Z',
              response_received_at: '2022-09-23T15:43:53.971548Z'
            },
            {
              status: 'OK',
              request: 'ska_oso_scripting.functions.devicecontrol.configure_resource',
              response: {
                result: 'this is a result'
              },
              request_args: {
                kwargs: {
                  subarray_id: '1'
                }
              },
              request_sent_at: '2022-09-23T15:43:53.971548Z',
              response_received_at: '2022-09-23T15:43:53.971548Z'
            },
            {
              status: 'OK',
              request: 'ska_oso_scripting.functions.devicecontrol.scan',
              response: {
                result: 'this is a result'
              },
              request_args: {
                kwargs: {
                  subarray_id: '1'
                }
              },
              request_sent_at: '2022-09-23T15:43:53.971548Z',
              response_received_at: '2022-09-23T15:43:53.971548Z'
            },
            {
              status: 'OK',
              request: 'ska_oso_scripting.functions.devicecontrol.release_all_resources',
              response: {
                result: 'this is a result'
              },
              request_args: {
                kwargs: {
                  subarray_id: '1'
                }
              },
              request_sent_at: '2022-09-23T15:43:53.971548Z',
              response_received_at: '2022-09-23T15:43:53.971548Z'
            },
            {
              error: {
                detail: 'this is an error'
              },
              status: 'ERROR',
              request: 'ska_oso_scripting.functions.devicecontrol.end',
              request_sent_at: '2022-09-23T15:43:53.971548Z'
            }
          ]
        },
        source: 'ODA',
        log_time: '2024-10-22T11:24:14.406107Z',
        comments: [
          {
            id: 7,
            log_comment: 'updated nov4 comment',
            operator_name: 'john',
            shift_id: 'shift-e71a091c-0841-47f0-9f57-8ee97c08bb77',
            image: {
              path: 'https://skao-611985328822-shift-log-tool-storage.s3.amazonaws.com/c5f3f901-bc62-41a2-8640-4325e8e5e3c0.png',
              timestamp: '2024-11-04T06:50:24.095341Z'
            },
            eb_id: 'eb-t0001-20241022-00004'
          },
          {
            id: 8,
            log_comment: 'this is comment',
            operator_name: 'peter',
            shift_id: 'shift-e71a091c-0841-47f0-9f57-8ee97c08bb77',
            eb_id: 'eb-t0001-20241022-00008'
          }
        ]
      }
    ],
    metadata: {
      created_by: 'john',
      created_on: '2024-10-22T11:24:04.388998Z',
      last_modified_by: 'john',
      last_modified_on: '2024-10-22T11:25:36.971764Z'
    }
  }
];

export default SHIFT_DATA_LIST;
