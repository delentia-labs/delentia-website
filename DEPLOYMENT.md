# RCT Labs Deployment Guide

## Deployment Overview

rctlabs.co is configured for seamless deployment on Vercel with optimized performance, SEO, and security settings.

## Pre-Deployment Checklist

- [x] SEO metadata configured (metadata.ts in app/layout.tsx)
- [x] Sitemap generated (app/sitemap.ts)
- [x] Robots.txt configured (app/robots.ts)
- [x] Manifest created for PWA support (app/manifest.ts)
- [x] Security headers added (next.config.mjs)
- [x] Image optimization enabled
- [x] Environment variables configured
- [x] Analytics setup (Vercel Analytics integrated)
- [ ] Public claim boundary check completed (`Public SDK verified` vs `Enterprise private snapshot` vs `Research / benchmark scope`)
- [ ] Public SDK counts synced from `rct-platform/docs/testing/TESTING_CANONICAL.md`

## Deployment Steps

### Step 1: Push to GitHub
\`\`\`bash
git add .
git commit -m "Complete rctlabs.co deployment setup"
git push origin main
\`\`\`

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select your GitHub repository
4. Click "Deploy"
5. Wait for deployment to complete

### Step 3: Configure Custom Domain
1. In Vercel dashboard: Settings โ’ Domains
2. Add domain: rctlabs.co
3. Update DNS records at your domain registrar:
   - Point to Vercel nameservers or
   - Add CNAME record pointing to your Vercel deployment
4. Wait 24-48 hours for DNS propagation

### Step 4: Verify SEO
- [ ] Google Search Console: Submit sitemap
- [ ] Bing Webmaster Tools: Add site
- [ ] Check Core Web Vitals in Vercel Analytics
- [ ] Verify robots.txt at /robots.txt
- [ ] Verify sitemap at /sitemap.xml
- [ ] Test Open Graph tags on social media

### Step 5: Verify Evidence Lanes
- [ ] `/en/about` shows public SDK proof separately from enterprise snapshot proof
- [ ] `/en/algorithms` does not imply enterprise-private test counts are public repo verification
- [ ] `/en/benchmark-summary` and `/en/methodology` remain the authority surfaces for benchmark scope and disclosure language
- [ ] Public SDK test count matches the latest canonical checkpoint from `rct-platform`

## Environment Variables

Required environment variables:
\`\`\`
NEXT_PUBLIC_SITE_URL=http://localhost:3005   # Frontend URL (port 3005)

# Search verification (set only when ready)
GOOGLE_SITE_VERIFICATION=...                 # Google Search Console HTML meta code
BING_SITE_VERIFICATION=...                   # Bing Webmaster Tools msvalidate.01 code


# Production values
# NEXT_PUBLIC_SITE_URL=https://rctlabs.co     # Production frontend
\`\`\`

Add these in Vercel Settings โ’ Environment Variables

### CORS

If integrating with an external API, ensure the backend allows the frontend origin (`rctlabs.co`).

## Performance Optimization

Current optimizations:
- Image optimization (AVIF/WebP formats)
- Font preconnection for faster loading
- Preload critical resources
- DNS prefetch control
- Security headers enabled

## Launch-Day Checklist

### External Dashboard Checks
- [ ] Vercel deployment is green on the production domain
- [ ] Domain DNS resolves correctly for `rctlabs.co` and `www` (if used)
- [ ] Google Search Console verification code is added in Vercel env and visible in page source
- [ ] Bing Webmaster Tools verification code is added in Vercel env and visible in page source
- [ ] Submit `https://rctlabs.co/sitemap.xml` to GSC and Bing
- [ ] Confirm Vercel Analytics is receiving production pageview data

### Trust / UX Checks
- [ ] Navbar does not imply working user login before auth launch
- [ ] Public pages do not expose placeholder notifications or fake account states
- [ ] Contact CTAs route to real contact / access-request flows
- [ ] Admin or internal routes are not indexable and do not read like production truth if preview data is shown

### Funnel QA
- [ ] Pricing tier without hosted checkout falls back to contact flow with the correct context
- [ ] Pricing tier with hosted checkout opens the intended Stripe Payment Link
- [ ] Whitepaper form submits successfully to `/api/newsletter`
- [ ] Contact form submits successfully to `/api/contact`
- [ ] EN and TH routes preserve the intended funnel context and prefilled copy

### Metadata / OG Checks
- [ ] `https://rctlabs.co/opengraph-image` returns a valid image response
- [ ] Homepage source contains canonical + hreflang tags for `/en` and `/th`
- [ ] Open Graph title, description, and image are correct on the deployed site
- [ ] Share preview is tested in at least one validator or messaging surface before announcement
- Gzip compression enabled by default

## Monitoring

- Vercel Analytics: Real-time performance metrics
- Web Vitals: Core Web Vitals dashboard
- Error tracking: Automatic error reporting
- Deploy logs: Available in Vercel dashboard

## Troubleshooting

### Sitemap not generated
\`\`\`bash
npm run build
\`\`\`

### DNS not resolving
- Wait 24-48 hours for DNS propagation
- Check your domain registrar settings
- Verify Vercel nameservers are correct

### Images not loading
- Ensure remote image domains are allowed in next.config.mjs
- Check image file formats (AVIF/WebP supported)
- Verify image URLs are accessible

## Rollback

To rollback to previous deployment:
1. Go to Vercel dashboard
2. Click "Deployments"
3. Select previous deployment
4. Click "Promote to Production"

## Support

For deployment support:
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- Contact: founder@rctlabs.co
