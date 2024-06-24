import React from 'react';
import { useTranslation } from 'react-i18next';

const ShiftLog = () => {
  const { t } = useTranslation('translations');

  return <h2> {t('text.title')}</h2>;
};

export default ShiftLog;
