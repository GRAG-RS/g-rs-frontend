# CorpDash - Enterprise Frontend Microservices Portal

Production-ready React 19 / Vite / TypeScript application built for deployment to **Amazon S3 Static Website Hosting**, **Amazon CloudFront CDN**, and **AWS Application Load Balancer (ALB)** API integration.

---

## 🚀 Quick Start & Local Development

### Requirements
- Node.js >= 18
- npm >= 9

### Commands

| Command | Description |
| :--- | :--- |
| `npm install` | Install all dependencies cleanly |
| `npm run dev` | Launch local Vite development server with HMR |
| `npm run type-check` | Execute strict TypeScript compilation check (`tsc -b`) |
| `npm run lint` | Run Oxlint analysis across the codebase |
| `npm run build` | Perform production build to `dist/` directory |
| `npm run preview` | Serve production build output locally for preview testing |

---

## 🌐 Environment Variables

Set environment variables in `.env` files depending on deployment stage:

```env
VITE_API_BASE_URL=https://api.company.com
VITE_ENV=production
VITE_APP_NAME=CorpDash
VITE_APP_VERSION=2.0.0
```

- `.env.development`: Targets development ALB endpoint (`https://dev-api.company.com` or `http://<ALB-DNS>`).
- `.env.staging`: Targets staging ALB endpoint (`https://staging-api.company.com`).
- `.env.production`: Targets production ALB endpoint (`https://api.company.com`).

---

## 📦 Amazon S3 Static Website Hosting Setup

To deploy the generated `dist/` directory to Amazon S3:

1. **Create S3 Bucket**: Enable **Static website hosting** in Bucket Properties.
2. **Set Index & Error Document**:
   - **Index document**: `index.html`
   - **Error document**: `index.html` *(Crucial for React Router client-side routing on direct URL refresh)*.
3. **Upload Build Assets**: Upload the entire contents of `dist/` to the S3 bucket root.

---

## ⚡ Amazon CloudFront CDN Distribution

When adding CloudFront in front of S3:

1. **Origin Settings**: Point CloudFront Origin to S3 static website endpoint.
2. **Behavior**: Forward all viewer requests to HTTPS (`Redirect HTTP to HTTPS`).
3. **Custom Error Responses** *(Required for Single Page App Routing)*:
   - **HTTP Error Code**: `404: Not Found` -> **Customize Error Response**: Yes -> **Response Page Path**: `/index.html` -> **HTTP Response Code**: `200: OK`.
   - **HTTP Error Code**: `403: Forbidden` -> **Customize Error Response**: Yes -> **Response Page Path**: `/index.html` -> **HTTP Response Code**: `200: OK`.

---

## 🔄 GitHub Actions CI/CD Integration

To automate production builds in GitHub Actions:

```yaml
name: Production CI/CD Build & Deploy

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: TypeScript Type Check
        run: npm run type-check

      - name: Oxlint Analysis
        run: npm run lint

      - name: Build Application
        run: npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
          VITE_ENV: production
```
