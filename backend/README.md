EasyBid backend

This is a minimal Express backend for authentication (register/login/profile/logout) using MongoDB.

Setup
- copy `.env.example` to `.env` and set values
- install deps: `npm install`
- run dev: `npm run dev`

Notes
- Uses httpOnly cookie to store JWT by default. Frontend can also send Authorization: Bearer <token> header.
