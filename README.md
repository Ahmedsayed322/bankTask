# TaskMangment (Node.js API)

Backend API built with **Express** for **Auth** + **Posts**.

- **DB**: MongoDB + Mongoose
- **Auth**: JWT Access Token + Refresh Token (stored in cookie)
- **Uploads**: Cloudinary (profile + post images)
- **Token revocation / caching**: Redis (Upstash REST)

> ملاحظة: المشروع يستخدم `type: "module"` (ESM) وبيقرأ المتغيرات من `src/config/.env`.

## Quick start

```bash
npm install
npm run start:dev
```

Server starts on `http://localhost:PORT` (default `3000`).

## Environment variables

Create `src/config/.env` (don’t commit it):

```env
PORT=3000

# MongoDB
DB_URI=mongodb://...

# JWT
JWT_SECRET_ACCESS=change_me
JWT_SECRET_REFRESH=change_me_too

# Cloudinary (required for upload endpoints)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Upstash Redis (used for token revocation)
UPSTASH_REDIS_REST_URL=https://xxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token
```

## Scripts

- **Dev**: `npm run start:dev`
- **Prod**: `npm run start`

## Authentication model (important)

Most protected routes require **both**:

- **Access Token** in header: `Authorization: Bearer <accessToken>`
- **Refresh Token cookie** named `refreshToken`

Flow:

- `POST /api/auth/login` returns `accessToken` in JSON **and** sets a `refreshToken` cookie.
- Use the `accessToken` in `Authorization` header for protected routes.
- When access token expires, call `GET /api/auth/refresh-token` (uses the cookie) to get a new `accessToken`.

## API

Base URL: `/api`

### Auth (`/api/auth`)

- `POST /register`
- `POST /login`
- `GET /getData` (protected)
- `DELETE /logout` (protected)
- `PATCH /Edit` (protected)
- `POST /upload/profile` (protected, multipart field: `profile`)
- `GET /refresh-token` (uses refresh cookie)

### Posts (`/api/posts`)

- `POST /` (protected, multipart field: `image`, body field: `content`)
- `GET /` (protected) supports pagination: `?page=1&limit=10`
- `GET /myPosts` (protected) supports pagination: `?page=1&limit=10`
- `DELETE /:id` (protected, owner only)
- `DELETE /admin/:id` (protected, admin only)

## cURL examples

### Register

```bash
curl -X POST "http://localhost:3000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"test","password":"123456","gender":"male"}'
```

### Login (captures cookies)

```bash
curl -i -c cookies.txt -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'
```

From the response JSON copy the `accessToken`, then:

### Get my data (protected)

```bash
ACCESS_TOKEN="paste_access_token_here"
curl -b cookies.txt "http://localhost:3000/api/auth/getData" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

### Refresh access token (uses cookie)

```bash
curl -b cookies.txt "http://localhost:3000/api/auth/refresh-token"
```

### Create post (with image)

```bash
ACCESS_TOKEN="paste_access_token_here"
curl -b cookies.txt -X POST "http://localhost:3000/api/posts" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -F "content=hello" \
  -F "image=@./path/to/image.jpg"
```

## CORS

Allowed origins are currently whitelisted in `src/app.bootstrap.js`:

- `http://localhost:4200`

## Security notes

- Never commit `src/config/.env`.
- If you ever committed/posted real secrets (DB URI / Cloudinary / Upstash), **rotate them immediately**.

