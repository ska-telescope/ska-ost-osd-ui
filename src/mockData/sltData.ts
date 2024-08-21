const sltData = [
  {
    annotations: 'Routine maintenance shift.',
    comments: 'All systems operational.',
    created_time: '2024-08-20T14:19:14.369552',
    id: 59,
    media: [
      {
        path: '/path/to/image1.png',
        type: 'image'
      }
    ],
    shift_end: '2024-07-01T16:00:00',
    shift_id: 'shift-20240820-59',
    shift_logs: [
      {
        info: {
          eb_id: 'eb-t0001-20240820-00001',
          interface: 'https://schema.skao.int/ska-oso-pdm-eb/0.1',
          metadata: {
            created_by: 'DefaultUser',
            created_on: '2024-08-20T08:55:08.377249Z',
            last_modified_by: 'DefaultUser',
            last_modified_on: '2024-08-20T08:55:08.377249Z',
            version: 1
          },
          request_responses: [
            {
              request: 'ska_oso_scripting.functions.devicecontrol.assign_resource',
              request_args: {
                kwargs: {
                  subarray_id: '1'
                }
              },
              request_sent_at: '2022-09-23T15:43:53.971548Z',
              response: {
                result: 'this is a result'
              },
              response_received_at: '2022-09-23T15:43:53.971548Z',
              status: 'OK'
            },
            {
              request: 'ska_oso_scripting.functions.devicecontrol.configure_resource',
              request_args: {
                kwargs: {
                  subarray_id: '1'
                }
              },
              request_sent_at: '2022-09-23T15:43:53.971548Z',
              response: {
                result: 'this is a result'
              },
              response_received_at: '2022-09-23T15:43:53.971548Z',
              status: 'OK'
            },
            {
              request: 'ska_oso_scripting.functions.devicecontrol.scan',
              request_args: {
                kwargs: {
                  subarray_id: '1'
                }
              },
              request_sent_at: '2022-09-23T15:43:53.971548Z',
              response: {
                result: 'this is a result'
              },
              response_received_at: '2022-09-23T15:43:53.971548Z',
              status: 'OK'
            },
            {
              request: 'ska_oso_scripting.functions.devicecontrol.release_all_resources',
              request_args: {
                kwargs: {
                  subarray_id: '1'
                }
              },
              request_sent_at: '2022-09-23T15:43:53.971548Z',
              response: {
                result: 'this is a result'
              },
              response_received_at: '2022-09-23T15:43:53.971548Z',
              status: 'OK'
            },
            {
              error: {
                detail: 'this is an error'
              },
              request: 'ska_oso_scripting.functions.devicecontrol.end',
              request_sent_at: '2022-09-23T15:43:53.971548Z',
              status: 'ERROR'
            }
          ],
          sbd_ref: 'sbd-t0001-20240812-00001',
          sbd_version: 1,
          sbi_ref: 'sbi-t0001-20240812-00002',
          sbi_status: 'failed',
          telescope: 'ska_mid'
        },
        log_time: '2024-08-20T14:25:09.752636',
        source: 'ODA'
      }
    ],
    shift_operator: {
      name: 'John Doe'
    },
    shift_start: '2024-08-20T14:19:14.369563'
  }
];

export default sltData;
