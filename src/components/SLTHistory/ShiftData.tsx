/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, Chip, Dialog, DialogContent, DialogTitle, Grid, Paper, TextField } from '@mui/material';
import { ButtonColorTypes, ButtonVariantTypes, DataGrid } from '@ska-telescope/ska-gui-components';
import moment from 'moment';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SLTHistoryDataModel from '../../Models/SLTHistory';
import ViewSLTHistory from '../ViewSLTHistory/ViewSLTHistory';
import { useLocation } from 'react-router-dom';
import SLTLogMockList from '../../mockData/SLTLogMock';

interface EntryFieldProps {
  data?: SLTHistoryDataModel;
}


const images = [   
{ id: 1, url: 'images/SLT History Page.png' },   
{ id: 2, url: 'images/SLT Log Page.png' },   
]; 


// const images = [   
//     { id: 1, url: 'https://example.com/image1.jpg' },   
//     { id: 2, url: 'https://example.com/image2.jpg' },   
//     { id: 3, url: 'https://example.com/image3.jpg' }, 
//     ]; 


const ImageDisplay = ({ imageArray }) => {   
    return (     <div >     
     {imageArray.map(image =>
      (        <img key={image.id} src={image.url} alt={`Image ${image.id}`}  width={550} height={400}/> ))} </div>  ); };

      
const ShiftDataTest = (data) => {
  const { t } = useTranslation('translations');
  const [openModal, setOpenModal] = useState(false);

  console.log('data', SLTLogMockList);

  let id = 1;
  SLTLogMockList.map((row) => {
    row.id = id++;
    return row;
  });

  const handleClose = () => {
    setOpenModal(false);
    // if (responseCode === 200) {
    //   updatedStatus();
    // }
  };

  const handleOpen = () => {
    setOpenModal(true);
    // if (responseCode === 200) {
    //   updatedStatus();
    // }
  };

  const columns = [
    {
      field: 'source',
      headerName: t('label.source'),
      width: 100,
      renderCell: (params) => params.row.shift_operator,
    },
    {
      field: 'info.eb_id',
      headerName: t('label.info'),
      width: 220,

      renderCell: (params) => params.row.info.eb_id,
    },
    {
      field: 'info.sbi_status',
      headerName: t('label.currentStatus'),
      width: 220,

      renderCell: (params) => params.row.info.sbi_status,
    },
    {
      field: 'log_time',
      headerName: t('label.logTime'),
      width: 220,
      renderCell: (params) => params.row.info.log_time,
    },
  ];

  return (

    // <Paper elevation={2} sx={{ border: 1, margin: 1 }}>
    <Box data-testid="availableData" m={1}>
    <Paper elevation={2} sx={{ border: 1}}>
      <h1 style={{ fontWeight: 'bold', textAlign: 'center', alignItems: 'center' }}>
        <b>Shift History Data </b>
      </h1>
      </Paper>
      {/* <hr /> */}
      <Grid container spacing={2} sx={{'paddingLeft': 2}} alignItems="left" textAlign='left'>
        <Grid item xs={12} sm={12} md={4}>
          <p style={{ fontWeight: 'bold'}}>
            Shift ID: {moment(data.data.shift_start).format('DD-MM-YYYY_hh_MM_SS') + '-' + data.data.id}{' '}
          </p>
        </Grid>
        <Grid item xs={12} sm={12} md={3}>
      </Grid>
        <Grid item xs={12} sm={12} md={5}>
        <p style={{ fontWeight: 'bold'}}>
            Shift Start: {moment(data.data.shift_start).format('DD-MM-YYYY hh:MM:SS')}{' '}
          </p>
          
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{'paddingLeft': 2}} alignItems="left" textAlign='left' >
        <Grid item xs={12} sm={12} md={4}>
        <p style={{ fontWeight: 'bold', alignItems: 'center' }}>
            Operator Name: {data.data.shift_operator.name}{' '}
          </p>
        </Grid>
        <Grid item xs={12} sm={12} md={3}>
      </Grid>
        <Grid item xs={12} sm={12} md={3}>
          <p style={{ fontWeight: 'bold', alignItems: 'center' }}>
            Shift End: {moment(data.data.shift_end).format('DD-MM-YYYY hh:MM:SS')}{' '}
          </p>
        </Grid>

        <Grid item xs={12} sm={12} md={2}>

        <p style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={handleOpen}>View Images</p>
            
        <Dialog
        aria-label={t('ariaLabel.dialog')}
        data-testid="dialogStatus"
        sx={{
          '& .MuiDialog-container': {
            '& .MuiPaper-root': {
              width: '100%',
              maxWidth: '1000px' // Set your width here
            }
          }
        }}
        open={openModal}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle>View Images
          
        </DialogTitle>
        <DialogContent dividers>
        <ImageDisplay imageArray={images} />
          
        </DialogContent>
       
        </Dialog>
        </Grid>

      </Grid>

      <Grid container spacing={2} sx={{'paddingLeft': 2, 'paddingTop': 2}} alignItems="left" textAlign='left' >

      <Grid item xs={12} sm={12} md={5}>
      
          <TextField
              sx={{ width: 700, alignContent: 'flex-end' }}
              id="outlined-multiline-static"
              label="Annotations"
              multiline
              rows={3}
              inputProps={{
                readOnly: true,
              }}
              
              value={data.data.annotations}
              
            />
      </Grid>

      <Grid item xs={12} sm={12} md={2}>
      </Grid>
      
      <Grid item xs={12} sm={12} md={5}>

        <TextField
              sx={{ width: 700, alignContent: 'flex-end' }}
              id="outlined-multiline-static"
              label="Operator Comments"
              multiline
              rows={3}
              inputProps={{
                readOnly: true,
              }}
              
              value={data.data.comments}
              
            />

        {/* <TextField
        type='text'
        id="outlined-multiline-static"
       
        variant='outlined'
        inputProps={
          {  }
        }
      /> */}
      </Grid>

      </Grid>

      <Paper elevation={2} sx={{ border: 1, marginTop: 1}}>
      <Grid container spacing={2} alignItems="left" textAlign='center'>

      <Grid item xs={12} sm={12} md={12}>

      <Paper elevation={2} sx={{ border: 1, margin: 1}}>
      
      <p style={{ fontWeight: 'bold', textAlign: 'center', alignItems: 'center' }}>Logs for Shift ID {moment(data.data.shift_start).format('DD-MM-YYYY_hh_MM_SS') + '-' + data.data.id}</p>
      </Paper>
      </Grid>

      <Grid item xs={12} sm={12} md={12}>

      <DataGrid
        ariaDescription={t('ariaLabel.gridTableDescription')}
        ariaTitle={t('ariaLabel.gridTable')}
        data-testid={data}
        columns={columns}
        rows={SLTLogMockList}
        showBorder
        testId="sltLogTable"
      />
      </Grid>
      

      </Grid>
      </Paper>

    </Box> 
    // </Paper>
  );
};

export default ShiftDataTest;


// data.data.shift_logs

{/* <Box  component="img"  sx={{    height: 233,
    width: 350,
    maxHeight: { xs: 233, md: 167 },
    maxWidth: { xs: 350, md: 250 },
  }}
  alt="The house from the offer."
  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&w=350&dpr=2"
/> */}