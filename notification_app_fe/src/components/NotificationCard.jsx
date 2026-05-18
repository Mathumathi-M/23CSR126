import React from 'react';

import {
  Card,
  CardContent,
  Typography
} from '@mui/material';

function NotificationCard({ item }) {

  return (

    <Card sx={{ marginBottom: 2 }}>

      <CardContent>

        <Typography variant="h6">
          {item.Type}
        </Typography>

        <Typography>
          {item.Message || item.Description || item.Title || 'No description available.'}
        </Typography>

        <Typography variant="body2">
          {item.Timestamp}
        </Typography>

      </CardContent>

    </Card>
  );
}
export default NotificationCard;