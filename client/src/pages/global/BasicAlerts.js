import * as React from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

export default function BasicAlerts({ alertMessage }) {
  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
      {alertMessage && (
        <Alert severity={alertMessage.severity}>{alertMessage.message}</Alert>
      )}
    </Stack>
  );
}