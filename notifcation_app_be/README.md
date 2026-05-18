# Notification Backend

This backend fetches notifications from the provided API,
implements priority sorting, and exposes a REST API for the frontend.

## Features

- Fetch notifications
- Priority sorting
- Pagination support
- Notification filtering
- Logging middleware

## Environment variables

The backend needs an authorization token to call the upstream notification API.

- `API_TOKEN` or `NOTIFICATIONS_API_TOKEN`: the token value to send in the request header
- `API_AUTH_HEADER`: optional header name (default: `Authorization`)
- `API_EMAIL`: registration email
- `API_NAME`: registration name
- `API_ROLL_NO`: registration roll number
- `API_ACCESS_CODE`: registration access code
- `API_CLIENT_ID`: registration client ID
- `API_CLIENT_SECRET`: registration client secret

If `API_TOKEN` is not provided, the backend will request a token from the auth endpoint using the registration credentials.

Example:

```powershell
$env:API_EMAIL = 'ramkrishna@abc.edu'
$env:API_NAME = 'ram krishna'
$env:API_ROLL_NO = 'aa1bb'
$env:API_ACCESS_CODE = 'xgAsNC'
$env:API_CLIENT_ID = 'd9cbb699-6a27-44a5-8d59-8b1befa816da'
$env:API_CLIENT_SECRET = 'tVJaaaRBSeXcRXeM'
node app.js
```

Or provide a direct token:

```powershell
$env:API_TOKEN = 'Bearer <your-token>'
node app.js
```

Or with a raw token:

```powershell
$env:API_TOKEN = '<your-token>'
node app.js
```