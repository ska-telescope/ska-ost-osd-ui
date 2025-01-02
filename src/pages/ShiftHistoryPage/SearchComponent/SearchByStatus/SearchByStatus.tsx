import { Autocomplete, Grid, TextField } from '@mui/material';
import {
  Button,
  ButtonColorTypes,
  ButtonSizeTypes,
  ButtonVariantTypes
} from '@ska-telescope/ska-gui-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';
import { SBIStatus } from '../../../../utils/constants';

interface EntryFieldProps {
  setFilterCriteria;
  searchFilter;
}

const SearchByStatus = ({ setFilterCriteria, searchFilter }: EntryFieldProps) => {
  const { t } = useTranslation('translations');
  const [statusValue, setValue] = React.useState<string>(
    searchFilter && searchFilter.status ? searchFilter.status : ''
  );
  const [inputValue, setInputValue] = React.useState('');
  const disableSearch = () => {
    if (statusValue && statusValue.length > 0) {
      return false;
    }
    return true;
  };

  const omitFilterCriteria = () => {
    const omitData = {
      status: statusValue
    };
    setFilterCriteria(omitData);
  };
  return (
    <Grid container spacing={2} justifyContent="left" sx={{ marginTop: '-15px' }}>
      <Grid item xs={12} sm={12} md={3}>
        <Autocomplete
          value={statusValue}
          onChange={(event, newValue: string | null) => {
            setValue(newValue);
          }}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          data-testid="sbiStatus"
          options={SBIStatus}
          renderInput={(params) => (
            <TextField {...params} label={t('label.searchByStatus')} variant="standard" />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={1} />
      <Grid item xs={12} sm={6} md={3} sx={{ marginTop: '15px' }}>
        <Button
          size={ButtonSizeTypes.Small}
          icon={<SearchIcon />}
          ariaDescription={t('ariaLabel.searchButtonDescription')}
          disabled={disableSearch()}
          color={ButtonColorTypes.Secondary}
          variant={ButtonVariantTypes.Contained}
          testId="logHistorySearch"
          label={t('label.searchById')}
          onClick={omitFilterCriteria}
          toolTip={t('toolTip.button.idSearch')}
        />
      </Grid>
    </Grid>
  );
};

export default SearchByStatus;
