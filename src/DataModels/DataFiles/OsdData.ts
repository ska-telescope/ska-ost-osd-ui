const OSD_DATA = [
  {
    capabilities: {
      low: {
        AA2: {
          available_bandwidth_hz: 150000000,
          cbf_modes: ['vis', 'pst', 'pss'],
          channel_width_hz: 5425.34722,
          max_baseline_km: 40,
          number_beams: 8,
          number_fsps: 10,
          number_pss_beams: 30,
          number_pst_beams: 4,
          number_station_ids: [
            315, 316, 317, 318, 321, 322, 323, 324, 345, 346, 347, 348, 349, 350, 351, 352, 353,
            354, 375, 376, 377, 378, 381, 382, 383, 384, 387, 388, 389, 390, 405, 406, 407, 408,
            429, 430, 431, 432, 433, 434, 447, 448, 449, 450, 459, 460, 461, 462, 465, 466, 467,
            468, 471, 472, 473, 474, 489, 490, 491, 492, 501, 502, 503, 504, 507, 508, 509, 510
          ],
          number_stations: 68,
          number_substations: 720,
          number_vlbi_beams: 0,
          number_zoom_channels: 1800,
          number_zoom_windows: 16,
          ps_beam_bandwidth_hz: 118000000
        },
        basic_capabilities: {
          max_frequency_hz: 350000000,
          min_frequency_hz: 50000000
        }
      },
      mid: {
        AA2: {
          allowed_channel_count_range_max: [214748647],
          allowed_channel_count_range_min: [1],
          allowed_channel_width_values: [
            210, 420, 840, 1680, 3360, 6720, 13440, 26880, 40320, 53760, 80640, 107520, 161280,
            215040, 322560, 416640, 430080, 645120
          ],
          available_bandwidth_hz: 800000000,
          available_receivers: ['Band_1', 'Band_2', 'Band_5a', 'Band_5b'],
          cbf_modes: ['correlation', 'pst', 'pss'],
          max_baseline_km: 110,
          number_dish_ids: [
            'SKA001',
            'SKA008',
            'SKA013',
            'SKA014',
            'SKA015',
            'SKA016',
            'SKA019',
            'SKA024',
            'SKA025',
            'SKA027',
            'SKA028',
            'SKA030',
            'SKA031',
            'SKA032',
            'SKA033',
            'SKA034',
            'SKA035',
            'SKA036',
            'SKA037',
            'SKA038',
            'SKA039',
            'SKA040',
            'SKA041',
            'SKA042',
            'SKA043',
            'SKA045',
            'SKA046',
            'SKA048',
            'SKA049',
            'SKA050',
            'SKA051',
            'SKA055',
            'SKA061',
            'SKA063',
            'SKA067',
            'SKA068',
            'SKA070',
            'SKA075',
            'SKA077',
            'SKA079',
            'SKA081',
            'SKA082',
            'SKA083',
            'SKA089',
            'SKA091',
            'SKA092',
            'SKA095',
            'SKA096',
            'SKA097',
            'SKA098',
            'SKA099',
            'SKA100',
            'SKA101',
            'SKA102',
            'SKA103',
            'SKA104',
            'SKA106',
            'SKA108',
            'SKA109',
            'SKA113',
            'SKA114',
            'SKA123',
            'SKA125',
            'SKA126'
          ],
          number_fsps: 26,
          number_meerkat_dishes: 4,
          number_meerkatplus_dishes: 0,
          number_pss_beams: 385,
          number_pst_beams: 6,
          number_ska_dishes: 64,
          number_zoom_channels: 14880,
          number_zoom_windows: 16,
          ps_beam_bandwidth_hz: 800000000
        },
        basic_capabilities: {
          dish_elevation_limit_deg: 15,
          receiver_information: [
            {
              max_frequency_hz: 1050000000,
              min_frequency_hz: 350000000,
              rx_id: 'Band_1'
            },
            {
              max_frequency_hz: 1760000000,
              min_frequency_hz: 950000000,
              rx_id: 'Band_2'
            },
            {
              max_frequency_hz: 3050000000,
              min_frequency_hz: 1650000000,
              rx_id: 'Band_3'
            },
            {
              max_frequency_hz: 5180000000,
              min_frequency_hz: 2800000000,
              rx_id: 'Band_4'
            },
            {
              max_frequency_hz: 8500000000,
              min_frequency_hz: 4600000000,
              rx_id: 'Band_5a'
            },
            {
              max_frequency_hz: 15400000000,
              min_frequency_hz: 8300000000,
              rx_id: 'Band_5b'
            }
          ]
        }
      }
    },
    observatory_policy: {
      cycle_description: 'Science Verification',
      cycle_information: {
        cycle_id: 'SKAO_2027_1',
        proposal_close: '20260512T15:00:00.000z',
        proposal_open: '20260327T12:00:00.000Z'
      },
      cycle_number: 1,
      cycle_policies: {
        normal_max_hours: 100
      },
      telescope_capabilities: {
        Low: 'AA2',
        Mid: 'AA2'
      }
    }
  }
];

export default OSD_DATA;
