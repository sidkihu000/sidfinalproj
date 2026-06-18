# 🚀 Deployment Guide

Complete guide to deploy BotHost Platform to various hosting services.

## Table of Contents
1. [Local Development](#local-development)
2. [Docker Deployment](#docker-deployment)
3. [Netlify Deployment](#netlify-deployment)
4. [Vercel Deployment](#vercel-deployment)
5. [AWS Deployment](#aws-deployment)
6. [DigitalOcean Deployment](#digitalocean-deployment)
7. [Traditional Server](#traditional-server)
8. [Environment Setup](#environment-setup)
9. [Troubleshooting](#troubleshooting)

---

## Local Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation

```bash
# Clone repository
git clone <repository-url>
cd bot-hosting-platform

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local with your settings
nano .env.local

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Development Commands

```bash
# Start dev server with HMR
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Run tests
npm run test
```

---

## Docker Deployment

### Using Docker Compose (Recommended)

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  # Frontend
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: bothost-frontend
    ports:
      - "3000:3000"
    environment:
      VITE_API_BASE_URL: http://backend:8000/api
      VITE_WS_URL: ws://backend:8000/ws
    depends_on:
      - backend
    restart: unless-stopped
    networks:
      - bothost-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Backend API
  backend:
    image: python:3.11-slim
    container_name: bothost-backend
    working_dir: /app
    volumes:
      - ./backend:/app
      - ./upload_bots:/app/upload_bots
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://bothost:password@db:5432/bothost
      REDIS_URL: redis://redis:6379
      FLASK_ENV: production
      FLASK_APP: app.py
    command: gunicorn --workers 4 --bind 0.0.0.0:8000 app:app
    depends_on:
      - db
      - redis
    restart: unless-stopped
    networks:
      - bothost-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # PostgreSQL Database
  db:
    image: postgres:15-alpine
    container_name: bothost-db
    environment:
      POSTGRES_USER: bothost
      POSTGRES_PASSWORD: secure_password_here
      POSTGRES_DB: bothost
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    restart: unless-stopped
    networks:
      - bothost-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U bothost"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: bothost-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped
    networks:
      - bothost-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: bothost-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
      - ./certbot/conf:/etc/letsencrypt:ro
    depends_on:
      - frontend
      - backend
    restart: unless-stopped
    networks:
      - bothost-network

networks:
  bothost-network:
    driver: bridge

volumes:
  postgres_data:
  redis_data:
```

Create `Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install serve to run the app
RUN npm install -g serve

# Copy built application from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install production dependencies only
RUN npm install --production

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["serve", "-s", "dist", "-l", "3000"]
```

### Deploy with Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart specific service
docker-compose restart frontend

# Scale backend workers
docker-compose up -d --scale backend=3
```

---

## Netlify Deployment

### Method 1: Using Netlify UI

1. **Prepare repository:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Select GitHub/GitLab/Bitbucket
   - Authorize and select your repository

3. **Configure build settings:**
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Node version:** 18.x

4. **Set environment variables:**
   - Click "Site settings" → "Build & deploy" → "Environment"
   - Add variables:
     ```
     VITE_API_BASE_URL=https://api.yourdomain.com
     VITE_BOT_TOKEN=your_token
     ```

5. **Deploy:**
   - Click "Deploy site"
   - Netlify builds and deploys automatically

### Method 2: Using Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Build locally
npm run build

# Deploy
netlify deploy --prod --dir=dist

# Watch for changes and auto-deploy
netlify watch
```

### Method 3: Deploy to Netlify Edge Functions

Create `netlify/edge-functions/api.js`:

```javascript
export default async (request, context) => {
  const url = new URL(request.url);
  
  if (url.pathname.startsWith('/api/')) {
    const apiUrl = `${Deno.env.get('API_BASE_URL')}${url.pathname}`;
    
    const response = await fetch(apiUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });
    
    return response;
  }
  
  return context.next();
};
```

---

## Vercel Deployment

### Quick Deploy

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel
```

### Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add environment variables
6. Click "Deploy"

### vercel.json Configuration

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_BASE_URL": "@api_base_url",
    "VITE_BOT_TOKEN": "@bot_token"
  },
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://api.yourdomain.com/:path*"
    }
  ]
}
```

---

## AWS Deployment

### Using AWS Amplify

1. **Prepare code:**
   ```bash
   git add .
   git commit -m "Deploy to AWS"
   git push origin main
   ```

2. **Connect to Amplify:**
   - Go to AWS Amplify Console
   - Select "Host web app"
   - Choose GitHub
   - Select repository and branch

3. **Configure build settings:**
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`

4. **Add environment variables:**
   - Add in Amplify console settings

5. **Deploy:**
   - Amplify auto-deploys on push

### Using AWS S3 + CloudFront

```bash
# Build application
npm run build

# Create S3 bucket
aws s3 mb s3://bothost-app --region us-east-1

# Upload files
aws s3 sync dist/ s3://bothost-app --delete

# Create CloudFront distribution
aws cloudfront create-distribution \
  --origin-domain-name bothost-app.s3.amazonaws.com \
  --default-root-object index.html

# Invalidate cache (after updates)
aws cloudfront create-invalidation \
  --distribution-id YOUR_DIST_ID \
  --paths "/*"
```

---

## DigitalOcean Deployment

### Using App Platform

1. Go to DigitalOcean Dashboard
2. Click "Create" → "App"
3. Select GitHub repository
4. Configure:
   - **Name:** bothost-app
   - **Type:** Web Service
   - **Build:** `npm run build`
   - **Output:** `dist`
   - **Run:** `npm start`
5. Add environment variables
6. Click "Deploy"

### Using Droplet + Docker

```bash
# SSH into droplet
ssh root@your_droplet_ip

# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clone repository
git clone your_repo_url
cd bot-hosting-platform

# Deploy
docker-compose up -d

# Setup SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx -y
sudo certbot certonly --standalone -d yourdomain.com
```

---

## Traditional Server Deployment

### Manual Deployment on VPS

```bash
# SSH into server
ssh user@server_ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Clone repository
git clone your_repo_url
cd bot-hosting-platform

# Install dependencies
npm install

# Build application
npm run build

# Create ecosystem.config.js for PM2
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'bothost',
    script: './dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      VITE_API_BASE_URL: 'http://your-api.com'
    }
  }]
};
EOF

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 config
pm2 save

# Setup PM2 startup
pm2 startup

# Setup Nginx reverse proxy
sudo apt install nginx -y

# Create Nginx config
sudo tee /etc/nginx/sites-available/bothost << EOF
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/bothost /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL with Certbot
sudo certbot certonly --nginx -d yourdomain.com
sudo systemctl restart nginx
```

---

## Environment Setup

### Production Environment Variables

Create `.env.production`:

```env
# API
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_WS_URL=wss://api.yourdomain.com/ws
VITE_API_TIMEOUT=30000

# Bot Configuration
VITE_BOT_TOKEN=your_prod_token
VITE_OWNER_ID=2119464081
VITE_UPDATE_CHANNEL=https://t.me/channel

# Features
VITE_ENABLE_BROADCASTING=true
VITE_ENABLE_FILE_UPLOAD=true
VITE_ENABLE_ADMIN_PANEL=true
VITE_ENABLE_SUBSCRIPTIONS=true

# Analytics
VITE_ENABLE_ANALYTICS=true
VITE_ANALYTICS_ID=UA-XXX-YYY

# Security
VITE_ENABLE_SECURITY_CHECKS=true
```

---

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm install
    
    - name: Build
      run: npm run build
    
    - name: Run tests
      run: npm run test
    
    - name: Deploy to Vercel
      uses: vercel/action@v4
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## Performance Optimization

### Build Optimization

```bash
# Analyze bundle size
npm install --save-dev webpack-bundle-analyzer

# Generate report
npm run build -- --analyze
```

### Caching Strategy

```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          motion: ['framer-motion'],
          icons: ['lucide-react']
        }
      }
    },
    // Cache busting
    polyfillModulePreload: true
  }
}
```

### CDN Setup

Use Cloudflare for automatic CDN:

```bash
# Update nameservers to Cloudflare
# Enable caching rules in Cloudflare dashboard
# Set cache TTL: 1 day for static, 5 minutes for API
```

---

## Monitoring & Logging

### Error Tracking

Use Sentry:

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://key@sentry.io/project",
  environment: "production",
  tracesSampleRate: 0.1,
});
```

### Performance Monitoring

```javascript
// Measure Core Web Vitals
web-vitals package

import { getCLS, getFID, getLCP } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getLCP(console.log);
```

---

## Troubleshooting

### Build Failures

```bash
# Clear cache
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Clean build
npm run build -- --force
```

### Deployment Errors

**Port Already in Use:**
```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>
```

**Memory Issues:**
```bash
# Increase Node memory
NODE_OPTIONS=--max-old-space-size=2048 npm run build
```

**CORS Errors:**
```javascript
// Configure backend to allow requests
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}));
```

---

## Backup & Recovery

### Backup Strategy

```bash
# Backup database
docker exec bothost-db pg_dump -U bothost bothost > backup.sql

# Backup volumes
docker run --rm -v bothost-postgres_data:/data -v $(pwd):/backup \
  busybox tar czf /backup/db-backup.tar.gz /data

# Backup application files
tar -czf app-backup.tar.gz .
```

### Disaster Recovery

```bash
# Restore database
docker exec -i bothost-db psql -U bothost bothost < backup.sql

# Restore volume
docker run --rm -v bothost-postgres_data:/data -v $(pwd):/backup \
  busybox tar xzf /backup/db-backup.tar.gz -C /
```

---

**Last Updated:** 2024
**Version:** 2.0.0
