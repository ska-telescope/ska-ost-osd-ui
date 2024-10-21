import { Chip, Divider, Grid, Paper } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { EBRequestResponseStatus, toUTCDateTimeFormat } from '../../utils/constants';

const RequestResponseDisplay = ({ responseArray }) => {
  const { t } = useTranslation('translations');
  const [openPannel] = useState(false);
  let id = 1;
  if (responseArray && responseArray.length > 0) {
    responseArray.map((row) => {
      row.id = id++;
      return row;
    });
  }
  return (
    <div>
      <span style={{ textDecoration: 'underline', fontWeight: 900, fontSize: '16px' }}>
        {t('label.ebObservations')}
      </span>
      {responseArray &&
        responseArray.map((dataItem) => (
          <div key={dataItem.id}>
            <Accordion defaultExpanded={openPannel}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography>
                  {dataItem.request ? dataItem.request : ''}{' '}
                  <Chip
                    size="small"
                    label={dataItem.status}
                    style={{ marginLeft: '10px' }}
                    color={dataItem.status === EBRequestResponseStatus.OK ? 'success' : 'error'}
                  />
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container justifyContent="start">
                  <Grid item xs={12} sm={12} md={6}>
                    <Typography>
                      {t('label.requestSentAt')}{' '}
                      <b>{toUTCDateTimeFormat(dataItem.request_sent_at)}</b>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    {dataItem.response_received_at && (
                      <Typography>
                        {t('label.responseReceivedAt')}{' '}
                        <b>{toUTCDateTimeFormat(dataItem.response_received_at)}</b>
                      </Typography>
                    )}
                  </Grid>
                </Grid>
                <Grid container justifyContent="start" style={{ paddingTop: '10px' }}>
                  <Grid item xs={12} sm={12} md={12}>
                    <Typography style={{ textDecoration: 'underline', fontSize: '15px' }}>
                      {' '}
                      <b>{t('label.details')}</b>
                    </Typography>
                    <pre>
                      {dataItem.status === EBRequestResponseStatus.OK
                        ? dataItem.response.result
                        : dataItem.error.detail}
                    </pre>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </div>
        ))}
    </div>
  );
};
const ShiftLogs = ({ logData }) => {
  const { t } = useTranslation('translations');
  let id = 1;
  if (logData && logData.length > 0) {
    logData.map((row) => {
      row.id = id++;
      return row;
    });
  }
  return (
    <div>
      {logData &&
        logData.length > 0 &&
        logData.map((data) => (
          <div key={data.id}>
            <Paper style={{ margin: '10px', paddingLeft: '10px' }}>
              <Grid container justifyContent="start">
                <Grid item xs={12} sm={12} md={7}>
                  <Grid container justifyContent="start">
                    <Grid item xs={12} sm={12} md={3}>
                      <Chip size="small" label={`Source:${data.source}`} color="secondary" />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                      <span>
                        {t('label.logTime')} <b>{toUTCDateTimeFormat(data.log_time)}</b>
                      </span>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={12} sm={12} md={12}>
                      <p>
                        {t('label.ebID')} <b>{data.info.eb_id}</b> {t('label.isStatus')}{' '}
                        <b>{data.info.sbi_status}</b>
                      </p>
                      <p>
                        {t('label.sbiID')} <b>{data.info.sbi_ref}</b> {t('label.isStatus')}{' '}
                        <b>{data.info.sbi_status}</b>
                      </p>
                    </Grid>
                  </Grid>
                  <Grid container justifyContent="start">
                    <Grid item xs={12} sm={12} md={12}>
                      <RequestResponseDisplay responseArray={data.info.request_responses} />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={5} />
              </Grid>
            </Paper>
            <Divider />
          </div>
        ))}
    </div>
  );
};

export default ShiftLogs;
