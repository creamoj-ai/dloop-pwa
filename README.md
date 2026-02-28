# 🚀 Dloop PWA - Catalogo Prodotti

Progressive Web App per dealer Dloop - Catalogo prodotti, carrello, checkout via WhatsApp.

## 🎯 Status

**Day 1 Complete ✅**
- [x] Next.js 15 boilerplate
- [x] TypeScript + Tailwind CSS
- [x] Supabase auth + real-time database
- [x] Zustand cart state management
- [x] PWA manifest + offline support
- [x] Build successful
- [ ] Deploy to Vercel
- [ ] Connect to dealer WhatsApp bot

## 📦 Tech Stack

- **Frontend**: Next.js 15 (App Router) + React 19
- **Styling**: Tailwind CSS 3
- **State**: Zustand (lightweight store)
- **Database**: Supabase (PostgreSQL + real-time)
- **Auth**: Supabase Magic Link
- **PWA**: Service Worker + Web App Manifest
- **Deploy**: Vercel (auto-deploy on git push)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm/yarn/bun
- Supabase account (free tier ok)

### Installation

```bash
# Clone repo
git clone <repo-url> dloop-pwa
cd dloop-pwa

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your Supabase keys
```

### Development

```bash
npm run dev
# Open http://localhost:3000
```

### Production Build

```bash
npm run build
npm start
```

## 📄 Pages

| Route | Description | Status |
|-------|-------------|--------|
| `/` | Home dashboard | ✅ |
| `/catalog` | Product listing (by dealer) | ✅ |
| `/cart` | Shopping cart | ✅ |
| `/checkout` | Order form | 🚧 Day 2 |

## 🛍️ Features (MVP)

### ✅ Completed
- Dealer selector (4 dealers)
- Product listing with real-time stock
- Add to cart with quantity
- Cart persistence (localStorage)
- Responsive design (mobile-first)
- PWA installable

### 🚧 In Progress
- Checkout form (Day 2)
- WhatsApp integration
- Payment integration
- Order history

### 🔮 Future
- Product images
- Reviews/ratings
- Wishlist
- Analytics dashboard

## 🗄️ Database Schema

### products
```sql
id (UUID)
dealer_id (text)
name (text)
description (text)
price (decimal)
image_url (text)
category (text)
stock (integer)
is_active (boolean)
created_at (timestamp)
```

### orders (coming soon)
```sql
id (UUID)
user_id (UUID)
dealer_id (text)
status (text) -- pending, confirmed, completed
items_json (json)
total (decimal)
created_at (timestamp)
```

## 🔧 Deployment

### Vercel (Recommended)

```bash
# Push to GitHub
git remote add origin <github-url>
git push -u origin master

# Deploy to Vercel via GitHub integration
# https://vercel.com/new
```

### Environment Variables (Vercel)
```
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## 📱 PWA Installation

### Mobile (iOS)
1. Open in Safari
2. Tap Share → Add to Home Screen

### Mobile (Android)
1. Open in Chrome
2. Menu → Install app
3. Tap Install

### Desktop (Chromium)
1. Open app
2. Omnibox → Install icon
3. Click Install

## 🧪 Testing Checklist

- [ ] Products load from Supabase
- [ ] Add to cart works offline
- [ ] Cart persists on page refresh
- [ ] Responsive on mobile/tablet
- [ ] PWA installable
- [ ] Service worker caches assets

## 📚 Documentation

- [PWA Sprint Plan](../PWA_SPRINT_PLAN.md)
- [Cost Comparison](../COST_COMPARISON_MOCKUP.md)
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)

## 🤝 Contributing

```bash
# Feature branch
git checkout -b feat/your-feature

# Commit
git commit -am "feat: your description"

# Push
git push origin feat/your-feature
```

## 📞 Support

For issues or questions:
1. Check [GitHub Issues](../../issues)
2. Contact dev team

## 📄 License

MIT

---

**Last Updated**: 2026-02-28
**Current Phase**: Day 1 - Foundation ✅
