import { Grid, TextField } from '@mui/material';
import {
  Button,
  ButtonColorTypes,
  ButtonSizeTypes,
  ButtonVariantTypes
} from '@ska-telescope/ska-gui-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';

interface EntryFieldProps {
  setFilterCriteria;
  searchFilter;
}

const SearchBySbiId = ({ setFilterCriteria, searchFilter }: EntryFieldProps) => {
  const { t } = useTranslation('translations');
  const [sbiValue, setValue] = React.useState<string>(
    searchFilter && searchFilter.sbi_id ? searchFilter.sbi_id : ''
  );
  const [inputValue, setInputValue] = React.useState(
    searchFilter && searchFilter.sbi_id ? searchFilter.sbi_id : ''
  );

  const disableSearch = () => {
    if (sbiValue && sbiValue.length > 0) {
      return false;
    }
    return true;
  };

  const emmitOperator = () => {
    const emmitData = {
      sbi_id: sbiValue
    };
    setFilterCriteria(emmitData);
  };
  return (
    <Grid container spacing={2} justifyContent="left" sx={{ marginTop: '-15px' }}>
      <Grid item xs={12} sm={12} md={3}>
        <TextField
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setValue(e.target.value);
          }}
          data-testid="sbiId"
          label={t('label.sbiId')}
          variant="standard"
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
          onClick={emmitOperator}
          toolTip={t('toolTip.button.idSearch')}
        />
      </Grid>
    </Grid>
  );
};

export default SearchBySbiId;
