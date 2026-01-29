# Deploy Backend to Vercel

## 1. Prerequisites

- [Vercel account](https://vercel.com)
- MongoDB URI (e.g. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- Optional: `OPENAI_API_KEY` for AI features, `JWT_SECRET` for auth

## 2. Deploy from Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new).
2. **Import** your repo (GitHub/GitLab/Bitbucket).
3. Set **Root Directory** to `backend` (so Vercel uses only the backend folder).
4. **Framework Preset:** Other (leave as is).
5. **Build Command:** `npm run build` (default from vercel.json).
6. **Output Directory:** leave empty (serverless API).
7. Click **Deploy**.

## 3. Environment Variables

In the Vercel project: **Settings → Environment Variables**, add:

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret for JWT tokens | Yes (recommended) |
| `JWT_EXPIRE` | e.g. `7d` | No |
| `OPENAI_API_KEY` | For AI hairstyle/pricing/insights | If using AI |
| `USER_WEB_URL` | User app URL for CORS | For production |
| `BARBER_WEB_URL` | Barber app URL for CORS | For production |
| `ADMIN_DASHBOARD_URL` | Admin app URL for CORS | For production |

Use the same variable names for **Production**, **Preview**, and **Development** if you use all three.

## 4. Deploy from CLI

```bash
cd backend
npm i -g vercel
vercel login
vercel
```

When prompted, link to an existing project or create a new one. Set env vars in the dashboard or with `vercel env add MONGODB_URI`.

## 5. API URL

After deploy, your API base URL will be:

- **Production:** `https://<your-project>.vercel.app`
- **Preview:** `https://<your-project>-<branch>.vercel.app`

Examples:

- Health: `GET https://<your-project>.vercel.app/health`
- Users: `POST https://<your-project>.vercel.app/api/users/register`

Update your frontend `apiUrl` / `API_URL` to this base URL.

## 6. Limitations on Vercel

- **Socket.IO / WebSockets:** Not supported in serverless. Real-time chat will not push events; REST chat (send message, get messages) still works.
- **Cold starts:** First request after idle can be slower (MongoDB connect + function start).
- **Timeout:** Default serverless timeout is 10s (upgradeable on Pro).

For full Socket.IO support, run the backend on a platform that supports long-lived processes (e.g. Railway, Render, Fly.io) and keep using `npm run start` with `server.js`.
