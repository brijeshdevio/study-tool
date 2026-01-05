# 🚀 Complete Guide: Deploying TypeScript Projects on Vercel

This guide covers everything you need to know about deploying TypeScript applications on Vercel, from basic setup to advanced configurations.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Configuration Files](#configuration-files)
4. [Deployment Methods](#deployment-methods)
5. [Environment Variables](#environment-variables)
6. [Common Issues & Solutions](#common-issues--solutions)
7. [Best Practices](#best-practices)
8. [Advanced Configurations](#advanced-configurations)

---

## 🔧 Prerequisites

- Node.js (v16 or later)
- TypeScript project
- GitHub/GitLab/Bitbucket repository (for Git-based deployment)
- Vercel account ([sign up here](https://vercel.com))

---

## 📁 Project Structure

### Basic Express + TypeScript Structure
```
my-ts-project/
├── src/
│   ├── index.ts          # Main application file
│   ├── routes/           # API routes (optional)
│   └── middleware/       # Custom middleware (optional)
├── api/                  # Compiled output (auto-generated)
├── package.json
├── tsconfig.json
├── vercel.json           # Vercel configuration
├── .env.example          # Environment variables template
└── README.md
```

### Key Requirements for Vercel
- **Entry Point**: Must export your app, not use `app.listen()`
- **Serverless Ready**: Functions should be stateless
- **TypeScript Config**: Proper `tsconfig.json` setup

---

## ⚙️ Configuration Files

### 1. `package.json`
```json
{
  "name": "my-ts-api",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "start": "node api/index.js",
    "vercel-build": "echo 'Building for Vercel deployment'"
  },
  "dependencies": {
    "express": "^5.1.0",
    "cors": "^2.8.5",
    "helmet": "^8.1.0"
  },
  "devDependencies": {
    "@types/express": "^5.0.3",
    "@types/cors": "^2.8.19",
    "@types/node": "^24.3.1",
    "typescript": "^5.9.2",
    "nodemon": "^3.0.0",
    "ts-node": "^10.9.2"
  }
}
```

### 2. `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "./src",
    "outDir": "./api",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "api"]
}
```

### 3. `vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/src/index.ts"
    }
  ]
}
```

### 4. Main Application File (`src/index.ts`)
```typescript
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000']
}));
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'API is running!',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy' });
});

// ⚠️ CRITICAL: Export app instead of using app.listen()
export default app;

// For local development only
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}
```

---

## 🚀 Deployment Methods

### Method 1: GitHub Integration (Recommended)

#### Step 1: Push to GitHub
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

#### Step 2: Connect Vercel to GitHub
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your repository
5. Configure settings (usually auto-detected)
6. Deploy!

#### Step 3: Automatic Deployments
- Every push to `main` triggers a new deployment
- Pull request previews are automatically generated
- Rollback to previous deployments easily

### Method 2: Vercel CLI

#### Installation
```bash
npm install -g vercel
```

#### Deployment
```bash
# Login
vercel login

# Deploy
vercel

# Production deployment
vercel --prod
```

### Method 3: Direct Git Integration
Connect other Git providers (GitLab, Bitbucket) through Vercel dashboard.

---

## 🔐 Environment Variables

### Local Development (`.env`)
```bash
NODE_ENV=development
PORT=3000
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
DATABASE_URL=your_database_url
API_SECRET=your_secret_key
```

### Vercel Dashboard Setup
1. Go to your project in Vercel dashboard
2. Navigate to "Settings" → "Environment Variables"
3. Add variables for different environments:
   - **Development**: Used for preview deployments
   - **Preview**: Used for PR previews
   - **Production**: Used for production deployment

### Environment-Specific Variables
```bash
# Production
CORS_ORIGINS=https://myapp.com,https://www.myapp.com
NODE_ENV=production

# Development
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
NODE_ENV=development
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot GET /" Error
**Cause**: App is still using `app.listen()` instead of exporting

**Solution**:
```typescript
// ❌ Wrong
app.listen(3000);

// ✅ Correct
export default app;
```

### Issue 2: Build Failures
**Cause**: Missing TypeScript types or configuration issues

**Solution**:
```bash
# Install all required @types packages
npm install -D @types/node @types/express @types/cors

# Check tsconfig.json target and module settings
```

### Issue 3: CORS Errors
**Cause**: Missing or incorrect CORS configuration

**Solution**:
```typescript
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));
```

### Issue 4: Function Timeout
**Cause**: Long-running operations in serverless functions

**Solution**:
- Optimize database queries
- Use async/await properly
- Consider using Vercel's Edge Runtime for faster cold starts

### Issue 5: Module Resolution Errors
**Cause**: Incorrect TypeScript module settings

**Solution**:
```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "esModuleInterop": true
  }
}
```

---

## ✨ Best Practices

### 1. Code Organization
```typescript
// Use proper TypeScript interfaces
interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

// Implement proper error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
});
```

### 2. Environment Management
```typescript
// Create a config object
const config = {
  port: process.env.PORT || 3000,
  corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  nodeEnv: process.env.NODE_ENV || 'development'
};
```

### 3. Logging
```typescript
import morgan from 'morgan';

// Use structured logging
app.use(morgan('combined'));

// Custom logger for production
const logger = {
  info: (message: string) => console.log(`[INFO] ${new Date().toISOString()}: ${message}`),
  error: (message: string) => console.error(`[ERROR] ${new Date().toISOString()}: ${message}`)
};
```

### 4. Health Checks
```typescript
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});
```

---

## 🔧 Advanced Configurations

### Custom Build Command
```json
{
  "builds": [
    {
      "src": "src/index.ts",
      "use": "@vercel/node",
      "config": {
        "includeFiles": ["assets/**"]
      }
    }
  ]
}
```

### Multiple Serverless Functions
```json
{
  "functions": {
    "src/api/users.ts": {
      "maxDuration": 30
    },
    "src/api/auth.ts": {
      "maxDuration": 10
    }
  }
}
```

### Custom Headers
```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
```

### Redirects and Rewrites
```json
{
  "redirects": [
    {
      "source": "/old-api/:path*",
      "destination": "/api/:path*",
      "permanent": true
    }
  ],
  "rewrites": [
    {
      "source": "/docs/:path*",
      "destination": "/api/docs/:path*"
    }
  ]
}
```

---

## 📊 Monitoring & Analytics

### Built-in Analytics
- Enable Vercel Analytics in dashboard
- Monitor function execution time
- Track deployment frequency

### Custom Monitoring
```typescript
// Add request timing
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
});
```

---

## 🔒 Security Best Practices

### 1. Use Helmet for Security Headers
```typescript
import helmet from 'helmet';
app.use(helmet());
```

### 2. Rate Limiting
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 3. Input Validation
```typescript
import { body, validationResult } from 'express-validator';

app.post('/api/users', 
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Process request
  }
);
```

---

## 🎯 Quick Deployment Checklist

- [ ] ✅ App exports instead of using `app.listen()`
- [ ] ✅ `vercel.json` configured correctly
- [ ] ✅ `tsconfig.json` has proper settings
- [ ] ✅ Environment variables set in Vercel dashboard
- [ ] ✅ CORS configured for production domains
- [ ] ✅ Error handling implemented
- [ ] ✅ Security middleware (helmet, rate limiting)
- [ ] ✅ Health check endpoint
- [ ] ✅ Proper TypeScript types
- [ ] ✅ Git repository connected to Vercel

---

## 🆘 Getting Help

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Community**: [GitHub Discussions](https://github.com/vercel/vercel/discussions)
- **Support**: [vercel.com/support](https://vercel.com/support)

---

**Happy Deploying! 🎉**

Remember: The key difference between local development and Vercel deployment is that Vercel uses serverless functions, not persistent servers. Export your app, don't listen on a port!
