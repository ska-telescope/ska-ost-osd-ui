import React, { useEffect, useState } from 'react';
import { CssBaseline, ThemeProvider, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  CopyrightModal,
  Footer,
  Header,
  Spacer,
  SPACER_VERTICAL,
  DropDown,
  InfoCard,
  InfoCardColorTypes
} from '@ska-telescope/ska-gui-components';
import { storageObject } from '@ska-telescope/ska-gui-local-storage';
import theme from '../../services/theme/theme';
import Loader from '../Loader/Loader';
import JsonEditor from '../JsonEditorComponent/JsonEditor';
import apiService from '../../services/api';
import { findThirdKey } from '../utils';

const HEADER_HEIGHT = 70;
const FOOTER_HEIGHT = 20;

function App() {
  const { t } = useTranslation('translations');
  const [showCopyright, setShowCopyright] = useState(false);
  const [jsonData, setJsonData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [show, setShow] = useState(true);
  const [cycleDataOptions, setCycleDataOptions] = useState([{ label: '', value: '' }]);
  const [cycleData, setCycleData] = useState();
  const [versionData, setVersionData] = useState(null);
  const [successMessage, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [displayMessageElement, setDisplayMessageElement] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      // for now this will work but we have to handle if data is not coming
      const response = await apiService.fetchOsdCycleData('cycle');
      if (response.status === 200 && response.data) {
        const optionValues = response.data.cycles.map((cycle) => {
          return { label: `Cycle_${cycle}`, value: cycle };
        });
        setCycleDataOptions(optionValues);
        setIsLoading(false);
      } else {
        setErrorMessage('msg.errorMessage');
        setCycleDataOptions([{ label: '', value: '' }]);
        setIsLoading(false);
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
          }, 5000);
          setVersionData(null);
          clearInterval(interval);
        } else {
          setIsLoading(false);
        }
      }, 3000);
    }
  }, [versionData]);

  const { help, helpToggle, themeMode, toggleTheme } = storageObject.useStore();

  const skao = t('toolTip.button.skao');
  const mode = t('toolTip.button.mode');
  const headerTip = t('toolTip.button.docs');
  const headerURL = t('toolTip.button.docsURL');
  const docs = { tooltip: headerTip, url: headerURL };
  const toolTip = { skao, mode };
  const version = process.env.VERSION;
  const osd_title = t('text.observatoryStaticData');
  const theStorage = {
    help,
    helpToggle,
    themeMode: themeMode.mode,
    toggleTheme
  };

  const handleCycle = async (e) => {
    setIsLoading(true);
    const data = await apiService.fetchOsdData('osd', e, null);
    setJsonData(data.data);
    setCycleData(e);
    setShow(false);
    setIsLoading(false);
  };

  const renderMessageResponse = () => (
    <InfoCard
      minHeight="15px"
      fontSize={16}
      color={InfoCardColorTypes.Success}
      message={t(successMessage)}
      testId="successStatusMsg"
    />
  );

  return (
    <ThemeProvider theme={theme(themeMode.mode)}>
      <CssBaseline enableColorScheme />
      <React.Suspense fallback={<Loader />}>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <CopyrightModal copyrightFunc={setShowCopyright} show={showCopyright} />
            <Header
              docs={docs}
              testId="headerId"
              title={osd_title}
              toolTip={toolTip}
              storage={theStorage}
            />
            {/* Example of the spacer being used to shift content from behind the Header component */}
            <Spacer size={HEADER_HEIGHT} axis={SPACER_VERTICAL} />
            <div style={{ position: 'absolute', zIndex: 2 }}>
              {displayMessageElement ? renderMessageResponse() : ''}
            </div>
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
            {/* Example of the spacer being used to stop content from being hidden behind the Footer component */}
            <Spacer size={FOOTER_HEIGHT} axis={SPACER_VERTICAL} />
            {/* Footer container: Even distribution of the children is built in */}
            <Footer copyrightFunc={setShowCopyright} testId="footerId" version={version} />
          </>
        )}
      </React.Suspense>
    </ThemeProvider>
  );
}

export default App;
