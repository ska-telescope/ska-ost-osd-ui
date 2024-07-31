import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, ButtonVariantTypes } from '@ska-telescope/ska-gui-components';
import { Box, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';

const Navigation = () => {
  const location = useLocation();
  const { t } = useTranslation('translations');

  return (
    <Box>
      <Grid container justifyContent="left">
        <Grid item xs={12} sm={12} md={2}>
        <Button
            icon={<SearchIcon />}
            ariaDescription="Button for starting shift"
            label={t('label.shiftStart')}
            testId="shiftStartButton"
            variant={ButtonVariantTypes.Contained}
            />
        </Grid>

        <Grid item xs={12} sm={12} md={4}>
        <Button
            icon={<SearchIcon />}
            ariaDescription="Button for ending shift"
            label={t('label.shiftEnd')}
            testId="shiftEndButton"
            variant={ButtonVariantTypes.Contained}
            />
        </Grid>
        
        
      </Grid>
    </Box>
  );
};

export default Navigation;
