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
} from '@ska-telescope/ska-gui-components';
import { storageObject } from '@ska-telescope/ska-gui-local-storage';
import theme from '../../services/theme/theme';
import Loader from '../Loader/Loader';
import JsonEditor from '../JsonEditorComponent/JsonEditor';
import apiService from '../../services/api';

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

  useEffect(() => {
    const loadData = async () => {
      try {
        const cycleAPIData = await apiService.fetchOsdCycleData('cycle');
        const optionValues = cycleAPIData.data.cycles.map((cycle) => {
          return { label: `Cycle_${cycle}`, value: cycle };
        });
        setCycleDataOptions(optionValues);
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);
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
    toggleTheme,
  };

  const handleCycle = async (e) => {
    setIsLoading(true);
    const data = await apiService.fetchOsdData('osd', e);
    setJsonData(data.data);
    setCycleData(e);
    setShow(false);
    setIsLoading(false);
  };

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

            {show ? (
              <Box sx={{ p: 2, width: 250 }}>
                <DropDown
                  options={cycleDataOptions}
                  testId="field-type-select"
                  value={cycleData}
                  setValue={(e) => handleCycle(e)}
                  label={t('label.cycleField')}
                  labelBold
                />
              </Box>
            ) : (
              <JsonEditor
                data-testid="json-editor"
                initialData={jsonData}
                onSave={async (data) => {
                  try {
                    await apiService.saveOsdData('osd', cycleData, data);
                  } catch (error) {
                    // Error will be propagated to the error boundary
                    throw error;
                  }
                }}
                onRelease={async () => {
                  try {
                    await apiService.releaseOsdData('release?cycle_id=1');
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
