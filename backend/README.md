# ShareBite Backend (OTP login)

## Features
- Node.js + Express
- MongoDB (Mongoose)
- Passwordless login via OTP emailed using Nodemailer + Gmail SMTP
- Temporary user records created if email not found, converted to permanent after verification
- OTP expiry (configured via OTP_EXPIRY_MINUTES)

## Setup
1. Copy `.env.example` to `.env` and fill values:
   - `MONGODB_URI`, `GMAIL_USER`, `GMAIL_PASS`, `JWT_SECRET`
   - For Gmail, consider using an App Password (recommended) or OAuth.

2. Install dependencies:
   ```
   npm install
   ```

3. Run the server:
   ```
   npm run dev
   ```

## API Endpoints
- `POST /api/auth/request-otp`
  - Body: `{ "email": "user@example.com", "role": "donor" }`
  - Response: `{ message: 'OTP sent to email' }`

- `POST /api/auth/verify-otp`
  - Body: `{ "email": "user@example.com", "otp": "123456" }`
  - Response: `{ message: 'OTP verified', token, user }`

## Frontend integration (example)
- When user clicks "Login with OTP", call `/api/auth/request-otp` with email.
- Show OTP input in UI, then call `/api/auth/verify-otp` to finish login and receive JWT.
