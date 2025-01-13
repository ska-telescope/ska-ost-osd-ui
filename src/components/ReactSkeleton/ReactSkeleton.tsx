import React from 'react';

/*
 *  Displaying information from the storage object
 *  ==============================================
 *
 *  import { storageObject } from '@ska-telescope/ska-gui-local-storage';
 *
 *  const { telescope, user } = storageObject.useStore();
 *
 *  <p data-testid="telescopeNameId">{telescope?.name}</p>
 *  <p data-testid="userNameId">{user?.username}</p>
 */

/*
 *  Displaying a number in an international format using i18n
 *  =========================================================
 *
 *  Specific formatting is done within the resource file for the specific language
 *
 *  <p>{t('intlNumber', { val: 2000 })}</p>
 */

/*
 *  Displaying a date in an international format using i18n
 *  ========================================================
 *
 *  Specific formatting is done within the resource file for the specific language
 *
 *  <p>{t('date_format_one', { date: new Date() })}</p>
 *  <p>{t('date_format_two', { date: new Date() })}</p>
 */

const ReactSkeleton = () => {
  return <p>Welcome OSD UI</p>;
};

export default ReactSkeleton;
