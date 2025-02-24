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
import { useNavigate } from 'react-router-dom';

interface cycleTypeOptionsType {
  label: string;
  value: string;
}

export const cycleTypeOptions: cycleTypeOptionsType[] = [{ label: 'Default', value: null }];

function HomePage(param?) {
  const navigate = useNavigate();
  const { t } = useTranslation('translations');
  const [jsonData, setJsonData] = useState({});
  const [show, setShow] = useState(true);
  const [cycleDataOptions, setCycleDataOptions] = useState([]);
  const [cycleData, setCycleData] = useState();
  const [versionData, setVersionData] = useState(null);
  const [successMessage, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [displayMessageElement, setDisplayMessageElement] = useState(false);
  const [displayFailedMessageElement, setDisplayFailedMessageElement] = useState(false);
  const [responseStatus, setResponseStatus] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  let interval;

  const handleRoute = (p) => {
    setShow(p);
  };

  useEffect(() => {
    const loadData = async () => {
      const response = await apiService.fetchOsdCycleData('cycle');
      if (response.status === 200 && response.data) {
        response.data.cycles.map((cycle) => {
          cycleTypeOptions.push({ label: `Cycle_${cycle}`, value: cycle });
        });

        setCycleDataOptions(cycleTypeOptions);
        //setIsLoading(false);
      } else {
        setErrorMessage('msg.errorMessage');
        setCycleDataOptions([{ label: 'Default', value: null }]);
        //setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (versionData !== null) {
      setTimeout(() => {
        checkVersionRelease();
      }, 240000);
    }
    if (responseStatus !== 200) {
      setTimeout(() => {
        clearInterval(interval);
        setMessage('msg.errorReleaseFailed');
        setDisplayFailedMessageElement(true);
        setTimeout(() => {
          setDisplayFailedMessageElement(false);
        }, 5000);
        clearInterval(interval);
      }, 600000);
    }
  }, [versionData]);

  const checkVersionRelease = () => {
    interval = setInterval(async () => {
      const response = await apiService.fetchOsdData('osd', null, versionData);
      if (response.status === 200) {
        setResponseStatus(response.status);
        setMessage('msg.releaseVersion');
        setDisplayMessageElement(true);
        setIsSuccess(true);
        setTimeout(() => {
          setDisplayMessageElement(false);
        }, 5000);
        clearInterval(interval);
      }
    }, 60000);
  };

  const handleCycle = async (e) => {
    const data = await apiService.fetchOsdData('osd', e, null);
    navigate(`/cycle`, { replace: true });
    setJsonData(data.data);
    setCycleData(e);
    setShow(false);
  };

  const renderMessageResponse = () => (
    <InfoCard
      minHeight="15px"
      fontSize={16}
      color={versionData != null ? InfoCardColorTypes.Info : InfoCardColorTypes.Success}
      message={t(successMessage, { version: versionData })}
      testId="successStatusMsg"
      variant={InfoCardVariantTypes.Outlined}
    />
  );

  const renderFailedMessageResponse = () => (
    <InfoCard
      minHeight="15px"
      fontSize={16}
      color={InfoCardColorTypes.Error}
      message={t(successMessage, { version: versionData })}
      testId="successStatusMsg"
      variant={InfoCardVariantTypes.Outlined}
    />
  );

  return (
    <>
      {param && show ? (
        <Box sx={{ p: 2, width: 250 }}>
          <DropDown
            options={cycleDataOptions}
            testId="fieldTypeSelect"
            value={cycleData}
            setValue={(e) => handleCycle(e)}
            label={t('label.cycleField')}
            labelBold
            errorText={t(errorMessage)}
          />
        </Box>
      ) : (
        <JsonEditor
          data-testid="JsonEditor"
          initialData={jsonData}
          onSave={async (data) => {
            const array_assembly = findThirdKey(data);
            try {
              await apiService.saveOsdData('osd', cycleData, data, array_assembly);
            } catch (error) {
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
              throw error;
            }
          }}
          versionData={versionData}
          cycleData={cycleData}
          setRoute={handleRoute}
          isSuccess={isSuccess}
        />
      )}
      <div style={{ position: 'absolute', zIndex: 2 }}>
        {displayMessageElement ? renderMessageResponse() : ''}
      </div>
      <div style={{ position: 'absolute', zIndex: 2 }}>
        {displayFailedMessageElement ? renderFailedMessageResponse() : ''}
      </div>
    </>
  );
}

export default HomePage;
