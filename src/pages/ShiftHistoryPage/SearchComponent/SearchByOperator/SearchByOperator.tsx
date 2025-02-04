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
import { operatorName } from '../../../../utils/constants';

interface EntryFieldProps {
  setFilterCriteria;
  searchFilter;
}

const SearchByOperator = ({ setFilterCriteria, searchFilter }: EntryFieldProps) => {
  const { t } = useTranslation('translations');
  const [operatorValue, setValue] = React.useState<string>(
    searchFilter && searchFilter.shift_operator ? searchFilter.shift_operator : ''
  );
  const [inputValue, setInputValue] = React.useState(
    searchFilter && searchFilter.shift_operator ? searchFilter.shift_operator : ''
  );

  const disableSearch = () => {
    if (operatorValue && operatorValue.length > 0) {
      return false;
    }
    return true;
  };

  const omitOperator = () => {
    const omitData = {
      shift_operator: operatorValue
    };
    setFilterCriteria(omitData);
  };
  return (
    <Grid container spacing={2} justifyContent="left" sx={{ marginTop: '-15px' }}>
      <Grid item xs={12} sm={12} md={3}>
        <Autocomplete
          value={operatorValue}
          onChange={(event, newValue: string) => {
            setValue(newValue);
          }}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          data-testid="logHistorySearchByOperatorName"
          options={operatorName}
          renderInput={(params) => (
            <TextField {...params} label={t('label.operatorName')} variant="standard" />
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
          testId="logHistorySearchByOperator"
          label={t('label.searchById')}
          onClick={omitOperator}
          toolTip={t('toolTip.button.idSearch')}
        />
      </Grid>
    </Grid>
  );
};

export default SearchByOperator;
