import * as React from 'react';
import { Box } from '@mui/material';
import { BackDrop, Progress } from '@ska-telescope/ska-gui-components';

export default function Loader() {
  return (
    <Box>
      <BackDrop open data-testid="loader-backdrop">
        <Progress size={100} testId="loader-progress" />
      </BackDrop>
    </Box>
  );
}
