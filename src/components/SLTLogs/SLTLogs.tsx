import React, { useEffect, useState } from 'react';
import { Button, ButtonVariantTypes, DropDown, TextEntry, InfoCardColorTypes, FileUpload, ButtonColorTypes} from '@ska-telescope/ska-gui-components';
import { Box, Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import Filters from '../Filters';
import Navigation from '../navigation';
import {
  ENTITY,
  ENTITY_ID,
  createdAfterDate,
  createdBeforeDate,
  last7days,
  makeUrlPath
} from '../../utils/constants';

import apiService from '../../services/apis';
import SLTLogTableList from './SLTTableList/SLTTableList';

interface OperatorName {
  label: string;
  value: string;
}

// interface EntryFieldProps {
//   id: string;
//   createdBefore: string;
//   createdAfter: string;
//   const [operator, setOperator] = React.useState(null);
// }

const getShiftStartTime = () => {

  const shiftStartTime = new Date();

  console.log(shiftStartTime)

}


const getShiftEndTime = () => {

  const shiftEndTime = new Date();

  console.log(shiftEndTime)

}


const operatorName: OperatorName[] = [
  { label: 'Chandler Bing', value: 'operator1' },
  { label: 'Jake Peralta', value: 'operator2' },
  { label: 'Ross Geller', value: 'operator3' },
  { label: 'Monica Geller', value: 'operator4' },
];

const defaultOption = operatorName[0];

function SLTLogs() {
  const { t } = useTranslation('translations');
  // const [dataDetails, setExecutionBlock] = useState([]);
  // const [filter, setFilter] = useState(null);
  // const { state } = useLocation();
  // const fetchExecutionBlock = async data => {
  //   const baseURL = makeUrlPath(data.id, data.createdBefore, data.createdAfter, ENTITY.shift);
  // };

  // useEffect(() => {
  //   if (!state) {
  //     fetchExecutionBlock(last7days);
  //   }
  // }, []);

  // const handleData = async (data: EntryFieldProps) => {
  //   fetchExecutionBlock(data);
  //   setFilter(data);
  // };

  // const onTriggerFunction = () => {
  //   const filterStates = {
  //     createdAfter: createdAfterDate,
  //     createdBefore: createdBeforeDate
  //   };
  //   if (filter) {
  //     fetchExecutionBlock(filter);
  //   } else {
  //     fetchExecutionBlock(filterStates);
  //   }
  // };
  return (
    <Box>
      <Grid container justifyContent="left">

      <Grid item xs={12} sm={12} md={2}>
        <DropDown
          options={operatorName}
          testId="operatorNameId"
          value={defaultOption}
          // setValue={operatorName}
          label={t('label.operatorName')}
          labelBold
          required
                />
        </Grid>

        <Grid item xs={12} sm={12} md={2}>
        <Button
            ariaDescription="Button for starting shift"
            label={t('label.shiftStart')}
            testId="shiftStartButton"
            onClick={getShiftStartTime}
            variant={ButtonVariantTypes.Contained}
            />
        </Grid>

        <Grid item xs={12} sm={12} md={2}>
        <Button
            ariaDescription="Button for ending shift"
            label={t('label.shiftEnd')}
            testId="shiftEndButton"
            onClick={getShiftEndTime}
            variant={ButtonVariantTypes.Contained}
            color={ButtonColorTypes.Error}
            />
        </Grid>


        <Grid item xs={12} sm={12} md={2}>
        <TextEntry
            ariaDescription="Put comments here"
            ariaTitle='Comments'
            height='40px'
            label={t('label.shiftEnd')}
            testId="commentId"
            />
        </Grid>

        <Grid item xs={12} sm={12} md={2}>
        <FileUpload
            testId="fileId"
            />
        </Grid>

        <Grid item xs={12} sm={12} md={2}>
        <Button
            ariaDescription="Button for submitting comment"
            label={t('label.submit')}
            testId="commentButton"
            onClick={getShiftEndTime}
            variant={ButtonVariantTypes.Contained}
            />
        </Grid>
    
       
        
      </Grid>
    </Box>
  );
}

export default SLTLogs;
