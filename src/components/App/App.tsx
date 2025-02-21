import React from 'react';
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
import Routing from '../Routing/Routing';

const HEADER_HEIGHT = 70;
const FOOTER_HEIGHT = 20;

function App() {
  const { t } = useTranslation('translations');
  const [showCopyright, setShowCopyright] = React.useState(false);
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

  return (
    <ThemeProvider theme={theme(themeMode.mode)}>
      <CssBaseline enableColorScheme />
      <React.Suspense fallback={<Loader />}>
        {}
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
        <Routing data-testid="routing" />
        {/* Example of the spacer being used to stop content from being hidden behind the Footer component */}
        <Spacer size={FOOTER_HEIGHT} axis={SPACER_VERTICAL} />
        {/* Footer container: Even distribution of the children is built in */}
        <Footer copyrightFunc={setShowCopyright} testId="footerId" version={version} />
      </React.Suspense>
    </ThemeProvider>
  );
}

export default App;
