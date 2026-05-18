import React from 'react';

import {
  Typography
} from '@mui/material';

function PriorityInbox() {

  return (

    <Typography
      variant="h4"
      sx={{
        marginBottom: 3,
        textAlign: 'center',
        fontWeight: 'bold'
      }}
    >
      Priority Inbox Notifications
    </Typography>
  );
}

export default PriorityInbox;