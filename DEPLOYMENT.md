# Deployment Guide - Jharkhand Tourism Platform

This guide covers deployment options for the Smart Digital Platform for Jharkhand Tourism.

## 🚀 Quick Deploy Options

### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Option 2: Netlify
```bash
# Build the project
npm run build

# Deploy to Netlify (drag & drop dist folder)
# Or use Netlify CLI
netlify deploy --prod --dir=dist
```

## 🔧 Environment Setup

### Required Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Configuration
1. Create a new Supabase project
2. Run database migrations from `supabase/migrations/`
3. Configure authentication providers (Google OAuth)
4. Set up Row Level Security policies
5. Upload sample data

### Google OAuth Setup
1. Go to Google Cloud Console
2. Create OAuth 2.0 Client ID
3. Add authorized redirect URIs:
   - `https://your-project.supabase.co/auth/v1/callback`
   - `https://your-domain.com/dashboard`
4. Configure OAuth consent screen
5. Add credentials to Supabase

## 📊 Production Checklist

### Performance
- [ ] Enable gzip compression
- [ ] Optimize images and assets
- [ ] Configure CDN for static files
- [ ] Enable caching headers
- [ ] Minify CSS and JavaScript

### Security
- [ ] Configure HTTPS
- [ ] Set up CORS policies
- [ ] Enable security headers
- [ ] Configure rate limiting
- [ ] Set up monitoring

### SEO & Analytics
- [ ] Add meta tags and Open Graph
- [ ] Configure Google Analytics
- [ ] Set up search console
- [ ] Generate sitemap
- [ ] Optimize for mobile

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Configure uptime monitoring
- [ ] Set up performance monitoring
- [ ] Enable logging
- [ ] Configure alerts

## 🌐 Domain Configuration

### Custom Domain Setup
1. Purchase domain (e.g., jharkhndtourism.gov.in)
2. Configure DNS records
3. Set up SSL certificate
4. Update environment variables
5. Test all functionality

### Subdomain Strategy
- `www.jharkhndtourism.gov.in` - Main platform
- `api.jharkhndtourism.gov.in` - API endpoints
- `admin.jharkhndtourism.gov.in` - Admin dashboard
- `seller.jharkhndtourism.gov.in` - Seller portal

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
```yaml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - uses: vercel/action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📱 Mobile App Deployment

### Progressive Web App (PWA)
- Service worker for offline functionality
- App manifest for installation
- Push notifications for updates
- Responsive design for all devices

### Native App Options
- React Native for iOS/Android
- Capacitor for hybrid apps
- Flutter for cross-platform
- Expo for rapid development

## 🏗️ Infrastructure Scaling

### Database Scaling
- Supabase automatic scaling
- Read replicas for performance
- Connection pooling
- Query optimization

### CDN Configuration
- Cloudflare for global distribution
- Image optimization
- Static asset caching
- DDoS protection

### Load Balancing
- Multiple server instances
- Geographic distribution
- Health checks
- Failover mechanisms

## 🔐 Security Hardening

### Application Security
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF tokens

### Infrastructure Security
- VPC configuration
- Firewall rules
- Access controls
- Regular security audits

## 📈 Performance Optimization

### Frontend Optimization
- Code splitting and lazy loading
- Image optimization and WebP
- Bundle size analysis
- Critical CSS inlining

### Backend Optimization
- Database indexing
- Query optimization
- Caching strategies
- API rate limiting

## 🌍 Multi-Region Deployment

### Global Distribution
- Multiple deployment regions
- Edge computing
- Regional data compliance
- Latency optimization

### Disaster Recovery
- Automated backups
- Multi-region failover
- Data replication
- Recovery procedures

## 📊 Monitoring & Analytics

### Application Monitoring
- Real-time error tracking
- Performance metrics
- User behavior analytics
- Business intelligence

### Infrastructure Monitoring
- Server health checks
- Database performance
- Network monitoring
- Cost optimization

## 🚨 Troubleshooting

### Common Issues
- Build failures
- Environment variable issues
- Database connection problems
- Authentication errors

### Debug Tools
- Browser developer tools
- Supabase dashboard
- Vercel/Netlify logs
- Error tracking services

## 📞 Support & Maintenance

### Regular Maintenance
- Security updates
- Dependency updates
- Performance monitoring
- Backup verification

### Support Channels
- GitHub issues for bugs
- Documentation updates
- Community support
- Emergency contacts

---

**Ready to deploy? Follow this guide step by step and your Jharkhand Tourism Platform will be live and serving users in no time!**

For deployment support, please check the troubleshooting section or create an issue in the repository.