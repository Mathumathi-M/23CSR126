const express = require('express');
const axios = require('axios');
const cors = require('cors');
const logger = require('../logging_middleware/logger');

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Notification backend is running. Use /priority-notifications to fetch data.'
  });
});

app.get('/my-new-route', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'My new route is available.'
  });
});

const PORT = process.env.PORT || 5000;

const AUTH_URL =
  'http://4.224.186.213/evaluation-service/auth';
const API_URL =
  'http://4.224.186.213/evaluation-service/notifications';

let directEnvToken = Boolean(process.env.API_TOKEN || process.env.NOTIFICATIONS_API_TOKEN);
let authToken = process.env.API_TOKEN || process.env.NOTIFICATIONS_API_TOKEN || '';
let authTokenExpiration = directEnvToken ? Infinity : 0;
const API_AUTH_HEADER = process.env.API_AUTH_HEADER || 'Authorization';

const API_EMAIL = process.env.API_EMAIL || 'ramkrishna@abc.edu';
const API_NAME = process.env.API_NAME || 'ram krishna';
const API_ROLL_NO = process.env.API_ROLL_NO || 'aa1bb';
const API_ACCESS_CODE = process.env.API_ACCESS_CODE || 'TEMP1234';
const API_CLIENT_ID = process.env.API_CLIENT_ID || 'd9cbb699-6a27-44a5-8d59-8b1befa816da';
const API_CLIENT_SECRET = process.env.API_CLIENT_SECRET || 'tVJaaaRBSeXcRXeM';

const priorityMap = {
  Placement: 3,
  Result: 2,
  Event: 1
};

const SAMPLE_NOTIFICATIONS = [
  {
    ID: 'temp-1',
    Type: 'Result',
    Message: 'mid-sem',
    Timestamp: '2026-04-22T17:51:30'
  },
  {
    ID: 'temp-2',
    Type: 'Placement',
    Message: 'CSX Corporation hiring',
    Timestamp: '2026-04-22T17:51:18'
  },
  {
    ID: 'temp-3',
    Type: 'Event',
    Message: 'farewell',
    Timestamp: '2026-04-22T17:51:06'
  },
  {
    ID: 'temp-4',
    Type: 'Result',
    Message: 'mid-sem',
    Timestamp: '2026-04-22T17:50:54'
  },
  {
    ID: 'temp-5',
    Type: 'Result',
    Message: 'project-review',
    Timestamp: '2026-04-22T17:50:42'
  },
  {
    ID: 'temp-6',
    Type: 'Result',
    Message: 'external',
    Timestamp: '2026-04-22T17:50:30'
  },
  {
    ID: 'temp-7',
    Type: 'Result',
    Message: 'project-review',
    Timestamp: '2026-04-22T17:50:18'
  },
  {
    ID: 'temp-8',
    Type: 'Event',
    Message: 'tech-fest',
    Timestamp: '2026-04-22T17:50:06'
  },
  {
    ID: 'temp-9',
    Type: 'Result',
    Message: 'project-review',
    Timestamp: '2026-04-22T17:49:54'
  },
  {
    ID: 'temp-10',
    Type: 'Placement',
    Message: 'Advanced Micro Devices Inc. hiring',
    Timestamp: '2026-04-22T17:49:42'
  }
];

function getFallbackNotifications(page, limit, type) {
  const filtered = SAMPLE_NOTIFICATIONS.filter((item) => {
    return type === 'All' || !type || item.Type === type;
  });

  const sorted = filtered.sort((a, b) => {
    const priorityDifference = priorityMap[b.Type] - priorityMap[a.Type];
    if (priorityDifference !== 0) {
      return priorityDifference;
    }
    return new Date(b.Timestamp) - new Date(a.Timestamp);
  });

  const start = (page - 1) * limit;
  return sorted.slice(start, start + limit);
}

async function fetchAuthToken() {
  const payload = {
    email: API_EMAIL,
    name: API_NAME,
    rollNo: API_ROLL_NO,
    accessCode: API_ACCESS_CODE,
    clientID: API_CLIENT_ID,
    clientSecret: API_CLIENT_SECRET
  };

  const response = await axios.post(AUTH_URL, payload);
  const data = response.data;

  if (!data.access_token) {
    throw new Error('Auth server did not return access_token');
  }

  const tokenType = data.token_type || 'Bearer';
  authToken = `${tokenType} ${data.access_token}`;
  const expiresIn = Number(data.expires_in) || 3600;
  authTokenExpiration = Date.now() + expiresIn * 1000 - 60000;

  return authToken;
}

async function getAuthToken() {
  if (authToken && (directEnvToken || Date.now() < authTokenExpiration)) {
    return authToken;
  }
  return await fetchAuthToken();
}

app.get('/priority-notifications', async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const type = req.query.notification_type || 'All';

  try {
    const token = await getAuthToken();

    if (!token) {
      const fallbackNotifications = getFallbackNotifications(page, limit, type);
      return res.status(200).json({
        success: true,
        count: fallbackNotifications.length,
        notifications: fallbackNotifications,
        message: 'Returned fallback notifications because upstream auth failed.'
      });
    }

    let url = `${API_URL}?page=${page}&limit=${limit}`;
    if (type && type !== 'All') {
      url += `&notification_type=${type}`;
    }

    const headers = {
      [API_AUTH_HEADER]: token.startsWith('Bearer ')
        ? token
        : `Bearer ${token}`
    };

    const response = await axios.get(url, { headers });
    const notifications = response.data.notifications || [];

    const sortedNotifications = notifications.sort((a, b) => {
      const priorityDifference = priorityMap[b.Type] - priorityMap[a.Type];
      if (priorityDifference !== 0) {
        return priorityDifference;
      }
      return new Date(b.Timestamp) - new Date(a.Timestamp);
    });

    const topNotifications = sortedNotifications.slice(0, 10);

    res.status(200).json({
      success: true,
      count: topNotifications.length,
      notifications: topNotifications
    });
  } catch (error) {
    console.error('Notification fetch failed, falling back to local data:', error.message || error);

    const fallbackNotifications = getFallbackNotifications(page, limit, type);
    return res.status(200).json({
      success: true,
      count: fallbackNotifications.length,
      notifications: fallbackNotifications,
      message: 'Returned fallback notifications because the upstream request failed.'
    });
  }
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(
      `Port ${PORT} is already in use. Stop the existing server or set PORT to a different value.`
    );
  } else {
    console.error('Server error:', error);
  }
  process.exit(1);
});
