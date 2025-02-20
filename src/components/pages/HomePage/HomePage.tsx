import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  DropDown,
  InfoCard,
  InfoCardColorTypes,
  InfoCardVariantTypes
} from '@ska-telescope/ska-gui-components';
import JsonEditor from '../../JsonEditorComponent/JsonEditor';
import apiService from '../../../services/api';
import { findThirdKey } from '../../utils';

function HomePage() {
  const { t } = useTranslation('translations');
  const [jsonData, setJsonData] = useState({});
  const [show, setShow] = useState(true);
  const [cycleDataOptions, setCycleDataOptions] = useState([{ label: '', value: '' }]);
  const [cycleData, setCycleData] = useState();
  const [versionData, setVersionData] = useState(null);
  const [successMessage, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [displayMessageElement, setDisplayMessageElement] = useState(false);

  useEffect(() => {
    console.log('home page call');
    const loadData = async () => {
      // for now this will work but we have to handle if data is not coming
      const response = await apiService.fetchOsdCycleData('cycle');
      if (response.status === 200 && response.data) {
        const optionValues = response.data.cycles.map((cycle) => {
          return { label: `Cycle_${cycle}`, value: cycle };
        });
        setCycleDataOptions(optionValues);
        // setIsLoading(false);
      } else {
        setErrorMessage('msg.errorMessage');
        setCycleDataOptions([{ label: '', value: '' }]);
        // setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (versionData !== null) {
      const interval = setInterval(async () => {
        const response = await apiService.fetchOsdData('osd', null, versionData);
        if (response.status === 200) {
          setMessage('msg.releaseVersion');
          setDisplayMessageElement(true);
          setTimeout(() => {
            setDisplayMessageElement(false);
          }, 3000);
          clearInterval(interval);
        } else {
          // setIsLoading(false);
        }
      }, 3000);
    }
  }, [versionData]);

  const handleCycle = async (e) => {
    // setIsLoading(true);
    const data = await apiService.fetchOsdData('osd', e, null);
    setJsonData(data.data);
    setCycleData(e);
    setShow(false);
    // setIsLoading(false);
  };

  const renderMessageResponse = () => (
    <InfoCard
      minHeight="15px"
      fontSize={16}
      color={versionData != null ? InfoCardColorTypes.Info : InfoCardColorTypes.Success}
      message={t(successMessage, { version: versionData })}
      testId="successStatusMsg"
      variant={InfoCardVariantTypes.Filled}
    />
  );

  return (
    <>
      {show ? (
        <Box sx={{ p: 2, width: 250 }}>
          <DropDown
            options={cycleDataOptions}
            testId="field-type-select"
            value={cycleData}
            setValue={(e) => handleCycle(e)}
            label={t('label.cycleField')}
            labelBold
            errorText={t(errorMessage)}
          />
        </Box>
      ) : (
        <JsonEditor
          data-testid="json-editor"
          initialData={jsonData}
          onSave={async (data) => {
            const array_assembly = findThirdKey(data);
            try {
              await apiService.saveOsdData('osd', cycleData, data, array_assembly);
            } catch (error) {
              // Error will be propagated to the error boundary
              throw error;
            }
          }}
          onRelease={async () => {
            try {
              const response = await apiService.releaseOsdData('osd_release?', cycleData);
              if (response?.status === 200) {
                setVersionData(response?.data?.version);
              }
            } catch (error) {
              // Error will be propagated to the error boundary
              throw error;
            }
          }}
        />
      )}
      <div style={{ position: 'absolute', zIndex: 2 }}>
        {displayMessageElement ? renderMessageResponse() : ''}
      </div>
    </>
  );
}

export default HomePage;
