const SLTLogMockList = [
  {
    info: {
      eb_id: 'eb-t0001-20240801-00004',
      sbd_ref: 'sbd-t0001-20240801-00002',
      sbi_ref: 'sbi-t0001-20240801-00003',
      metadata: {
        version: 1,
        created_by: 'DefaultUser',
        created_on: '2024-08-01T17:24:38.004027Z',
        last_modified_by: 'DefaultUser',
        last_modified_on: '2024-08-01T17:24:38.004027Z'
      },
      interface: 'https://schema.skao.int/ska-oso-pdm-eb/0.1',
      telescope: 'ska_mid',
      sbi_status: 'Executing',
      sbd_version: 1,
      request_responses: [
        {
          request: 'ska_oso_scripting.functions.devicecontrol.release_all_resources',
          request_args: {
            kwargs: {
              subarray_id: '1'
            }
          },
          status: 'OK',
          response: {
            result: 'this is a result'
          },
          request_sent_at: '2022-09-23T15:43:53.971548+00:00',
          response_received_at: '2022-09-23T15:43:53.971548+00:00'
        },
        {
          request: 'ska_oso_scripting.functions.devicecontrol.scan',
          status: 'ERROR',
          error: {
            detail: 'this is an error'
          },
          request_sent_at: '2022-09-23T15:43:53.971548+00:00'
        }
      ]
    },
    source: 'ODA',
    log_time: '2024-08-02T02:48:46.163684'
  },
  {
    info: {
      eb_id: 'eb-t0001-20240801-00005',
      sbd_ref: 'sbd-t0001-20240801-00002',
      sbi_ref: 'sbi-t0001-20240801-00003',
      metadata: {
        version: 1,
        created_by: 'DefaultUser',
        created_on: '2024-08-01T18:18:08.243246Z',
        last_modified_by: 'DefaultUser',
        last_modified_on: '2024-08-01T18:18:08.243246Z'
      },
      interface: 'https://schema.skao.int/ska-oso-pdm-eb/0.1',
      telescope: 'ska_mid',
      sbi_status: 'Executing',
      sbd_version: 1,
      request_responses: [
        {
          request: 'ska_oso_scripting.functions.devicecontrol.release_all_resources',
          request_args: {
            kwargs: {
              subarray_id: '1'
            }
          },
          status: 'OK',
          response: {
            result: 'this is a result'
          },
          request_sent_at: '2022-09-23T15:43:53.971548+00:00',
          response_received_at: '2022-09-23T15:43:53.971548+00:00'
        },
        {
          request: 'ska_oso_scripting.functions.devicecontrol.scan',
          status: 'ERROR',
          error: {
            detail: 'this is an error'
          },
          request_sent_at: '2022-09-23T15:43:53.971548+00:00'
        }
      ]
    },
    source: 'ODA',
    log_time: '2024-08-02T02:48:58.228541'
  },
  {
    info: {
      eb_id: 'eb-t0001-20240801-00006',
      sbd_ref: 'sbd-t0001-20240801-00002',
      sbi_ref: 'sbi-t0001-20240801-00003',
      metadata: {
        version: 1,
        created_by: 'DefaultUser',
        created_on: '2024-08-01T18:18:56.804453Z',
        last_modified_by: 'DefaultUser',
        last_modified_on: '2024-08-01T18:18:56.804453Z'
      },
      interface: 'https://schema.skao.int/ska-oso-pdm-eb/0.1',
      telescope: 'ska_mid',
      sbi_status: 'Executing',
      sbd_version: 1,
      request_responses: []
    },
    source: 'ODA',
    log_time: '2024-08-02T02:49:03.132600'
  },
  {
    info: {
      eb_id: 'eb-t0001-20240801-00007',
      sbd_ref: 'sbd-t0001-20240801-00002',
      sbi_ref: 'sbi-t0001-20240801-00003',
      metadata: {
        version: 1,
        created_by: 'DefaultUser',
        created_on: '2024-08-01T20:22:21.180638Z',
        last_modified_by: 'DefaultUser',
        last_modified_on: '2024-08-01T20:22:21.180638Z'
      },
      interface: 'https://schema.skao.int/ska-oso-pdm-eb/0.1',
      telescope: 'ska_mid',
      sbi_status: 'Executing',
      sbd_version: 1,
      request_responses: []
    },
    source: 'ODA',
    log_time: '2024-08-02T02:49:05.199193'
  },
  {
    info: {
      eb_id: 'eb-t0001-20240801-00004',
      sbd_ref: 'sbd-t0001-20240801-00002',
      sbi_ref: 'sbi-t0001-20240801-00003',
      metadata: {
        version: 1,
        created_by: 'DefaultUser',
        created_on: '2024-08-01T17:24:38.004027Z',
        last_modified_by: 'DefaultUser',
        last_modified_on: '2024-08-01T17:24:38.004027Z'
      },
      interface: 'https://schema.skao.int/ska-oso-pdm-eb/0.1',
      telescope: 'ska_mid',
      sbi_status: 'Created',
      sbd_version: 1,
      request_responses: []
    },
    source: 'ODA',
    log_time: '2024-08-02T02:42:32.084289'
  },
  {
    info: {
      eb_id: 'eb-t0001-20240801-00005',
      sbd_ref: 'sbd-t0001-20240801-00002',
      sbi_ref: 'sbi-t0001-20240801-00003',
      metadata: {
        version: 1,
        created_by: 'DefaultUser',
        created_on: '2024-08-01T18:18:08.243246Z',
        last_modified_by: 'DefaultUser',
        last_modified_on: '2024-08-01T18:18:08.243246Z'
      },
      interface: 'https://schema.skao.int/ska-oso-pdm-eb/0.1',
      telescope: 'ska_mid',
      sbi_status: 'Created',
      sbd_version: 1,
      request_responses: []
    },
    source: 'ODA',
    log_time: '2024-08-02T02:42:32.084326'
  },
  {
    info: {
      eb_id: 'eb-t0001-20240801-00006',
      sbd_ref: 'sbd-t0001-20240801-00002',
      sbi_ref: 'sbi-t0001-20240801-00003',
      metadata: {
        version: 1,
        created_by: 'DefaultUser',
        created_on: '2024-08-01T18:18:56.804453Z',
        last_modified_by: 'DefaultUser',
        last_modified_on: '2024-08-01T18:18:56.804453Z'
      },
      interface: 'https://schema.skao.int/ska-oso-pdm-eb/0.1',
      telescope: 'ska_mid',
      sbi_status: 'Created',
      sbd_version: 1,
      request_responses: []
    },
    source: 'ODA',
    log_time: '2024-08-02T02:42:32.084329'
  },
  {
    info: {
      eb_id: 'eb-t0001-20240801-00007',
      sbd_ref: 'sbd-t0001-20240801-00002',
      sbi_ref: 'sbi-t0001-20240801-00003',
      metadata: {
        version: 1,
        created_by: 'DefaultUser',
        created_on: '2024-08-01T20:22:21.180638Z',
        last_modified_by: 'DefaultUser',
        last_modified_on: '2024-08-01T20:22:21.180638Z'
      },
      interface: 'https://schema.skao.int/ska-oso-pdm-eb/0.1',
      telescope: 'ska_mid',
      sbi_status: 'Created',
      sbd_version: 1,
      request_responses: []
    },
    source: 'ODA',
    log_time: '2024-08-02T02:42:32.084331'
  }
];

export default SLTLogMockList;
