import React, { useEffect } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  CopyrightModal,
  Footer,
  Header,
  Spacer,
  SPACER_VERTICAL
} from '@ska-telescope/ska-gui-components';
import { storageObject } from '@ska-telescope/ska-gui-local-storage';
import theme from '../../services/theme/theme';
import Loader from '../Loader/Loader';
import JsonEditor from '../JsonEditor/JsonEditor';
import { fetchOsdData, saveOsdData } from '../../services/api/osdApi';

const HEADER_HEIGHT = 70;
const FOOTER_HEIGHT = 20;

function App() {
  const { t } = useTranslation('translations');
  const [showCopyright, setShowCopyright] = React.useState(false);
  const [jsonData, setJsonData] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchOsdData(1);
        setJsonData(data);
      } catch (error) {
        // Error handling will be managed by the error boundary
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);
  const { help, helpToggle, telescope, themeMode, toggleTheme, updateTelescope } =
    storageObject.useStore();

  const skao = t('toolTip.button.skao');
  const mode = t('toolTip.button.mode');
  const headerTip = t('toolTip.button.docs');
  const headerURL = t('toolTip.button.docsURL');
  const docs = { tooltip: headerTip, url: headerURL };
  const toolTip = { skao, mode };
  const version = process.env.VERSION;
  const theStorage = {
    help,
    helpToggle,
    telescope,
    themeMode: themeMode.mode,
    toggleTheme,
    updateTelescope
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
          title="Observatory Static Data"
          toolTip={toolTip}
          storage={theStorage}
        />
        {
          // Example of the spacer being used to shift content from behind the Header component
        }
        <Spacer size={HEADER_HEIGHT} axis={SPACER_VERTICAL} />
        {
          // This is where we render the JSON Editor
        }
        <JsonEditor 
          initialData={jsonData} 
          cycleId={1}
          onSave={async (data) => {
            try {
              await saveOsdData(data);
            } catch (error) {
              // Error will be propagated to the error boundary
              throw error;
            }
          }}
        />
        {
          // Example of the spacer being used to stop content from being hidden behind the Footer component
        }
        <Spacer size={FOOTER_HEIGHT} axis={SPACER_VERTICAL} />
        {
          // Footer container :
          // Even distribution of the children is built in
        }
        <Footer copyrightFunc={setShowCopyright} testId="footerId" version={version} />
          </>
        )
      }
      </React.Suspense>
    </ThemeProvider>
  );
}

export default App;
