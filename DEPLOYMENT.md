# Deployment Guide

## Option 1: Render.com (Recommended - Free)

### Single Service Deployment (Easiest)

1. **Push to GitHub** - Make sure your code is on GitHub

2. **Create Render Account** - Go to [render.com](https://render.com) and sign up with GitHub

3. **Create New Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the branch `claude/hosting-site-admin-panel-0194Eq6bxkd8y295gEPSE5Bc`

4. **Configure the Service**
   ```
   Name: hosting-company-app
   Environment: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

5. **Add Environment Variables**
   ```
   NODE_ENV = production
   JWT_SECRET = your-secret-key-here-make-it-long
   PORT = 3001
   ```

6. **Deploy** - Click "Create Web Service"

Your app will be live at `https://your-app-name.onrender.com`

---

## Option 2: Railway.app (Free Tier)

1. Go to [railway.app](https://railway.app) and sign up with GitHub

2. Click "New Project" → "Deploy from GitHub repo"

3. Select your repository and branch

4. Add environment variables:
   ```
   NODE_ENV = production
   JWT_SECRET = your-secret-key
   ```

5. Railway will auto-detect Node.js and deploy

---

## Option 3: Fly.io (Free Tier)

1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`

2. Login: `fly auth login`

3. Launch app: `fly launch`

4. Deploy: `fly deploy`

---

## Option 4: Vercel + Railway Split Deployment

### Frontend on Vercel (Free)
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repo
3. Set root directory to `frontend`
4. Add environment variable:
   ```
   VITE_API_URL = https://your-railway-backend-url.com/api
   ```

### Backend on Railway (Free)
1. Deploy backend folder to Railway
2. Set environment variables for JWT_SECRET

---

## Local Development

```bash
# Install dependencies
npm run install:all

# Seed database
cd backend && npm run seed && cd ..

# Run development servers
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- Admin: http://localhost:5173/admin

## Default Admin Login
- Email: `admin@hostingcompany.com`
- Password: `admin123`

> ⚠️ **Important**: Change the default password after first login in production!
