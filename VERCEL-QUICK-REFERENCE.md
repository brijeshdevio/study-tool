# ⚡ Vercel TypeScript Deployment - Quick Reference

## 🚨 Critical Changes Required

### 1. Main Entry Point
```typescript
// ❌ NEVER do this for Vercel
app.listen(3000);

// ✅ ALWAYS export for Vercel
export default app;
```

### 2. Essential Files

#### `vercel.json`
```json
{
  "version": 2,
  "builds": [{ "src": "src/index.ts", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "/src/index.ts" }]
}
```

#### `package.json` scripts
```json
{
  "scripts": {
    "build": "tsc",
    "vercel-build": "echo 'Building for Vercel'"
  }
}
```

#### `tsconfig.json` essentials
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "rootDir": "./src",
    "outDir": "./api"
  }
}
```

## 🚀 Deployment Steps

### GitHub Method (Recommended)
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import repository
4. Deploy!

### CLI Method
```bash
npm install -g vercel
vercel login
vercel
```

## 🔧 Environment Variables
Set in Vercel Dashboard → Settings → Environment Variables:
- `CORS_ORIGINS` = `https://yourdomain.com,http://localhost:3000`
- `NODE_ENV` = `production`

## 🐛 Common Fixes

| Error | Solution |
|-------|----------|
| "Cannot GET /" | Export app instead of app.listen() |
| CORS errors | Set CORS_ORIGINS env variable |
| Build fails | Install @types packages |
| Function timeout | Optimize async operations |

## 📝 Checklist
- [ ] App exports instead of listening
- [ ] vercel.json configured
- [ ] Environment variables set
- [ ] CORS configured
- [ ] TypeScript types installed

## 🔗 Useful Links
- [Full Guide](./VERCEL-DEPLOYMENT-GUIDE.md)
- [Vercel Docs](https://vercel.com/docs)
- [TypeScript Config](https://www.typescriptlang.org/tsconfig)
