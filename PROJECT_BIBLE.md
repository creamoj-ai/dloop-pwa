# 📖 DLOOP PROJECT BIBLE

**Data:** 2026-03-01
**Version:** MVP 0.7 (70% Complete)
**Status:** Live on Vercel (dloop.vercel.app)

---

## 🎯 PROJECT VISION

**Dloop** = Local delivery marketplace connecting customers to nearby dealers via PWA + Rider app + WhatsApp bot.

**Market:** Napoli (1M+ inhabitants)
**Competitors:** Glovo, JustEat, Deliveroo, Uber Eats
**Differentiation:** Dealer-first approach + WhatsApp integration + Real-time tracking

---

## 📊 MARKET SUCCESS PROBABILITY: **65%**

### ✅ SUCCESS FACTORS
- Product-Market Fit (local delivery demand high)
- MVP Solid (4 active dealers, core features work)
- Tech Stack Modern (Next.js 15, Supabase, Flutter)
- Go-to-market Clear (dealer recruitment + customer acquisition)
- WhatsApp Bot Live (dealer pilots activated)

### ❌ RISK FACTORS
- Massive Competition (Glovo dominates)
- High CAC (€2-5 customer, €500-2000 dealer)
- Logistics Complex (rider recruitment, margins thin)
- MVP Incomplete (Stripe missing, dashboard basic)
- Solo Founder (need team to scale)

### 📈 SCENARIOS
- **Best Case (20%):** 100 dealers, €500k fundraise, €10M+ exit
- **Base Case (45%):** 20-30 dealers, break-even in 18 months, €2-5M ARR
- **Worst Case (35%):** Can't convince dealers, runout of capital in 12 months

---

## 🏗️ CURRENT ARCHITECTURE

### **Unified Codebase (dloop)**
```
dloop/ (GitHub: creamoj-ai/dloop-pwa)
├─ / (Home - Customer landing)
├─ /catalog (Marketplace - Search/Filter, Category-First Logic)
├─ /cart, /checkout (Shopping flow)
├─ /history (Order history - Real-time)
├─ /order/[id] (Order tracking - Real-time)
├─ /dealer/signup (Dealer recruitment)
├─ /dealer/dashboard (Dealer panel)
└─ /api/* (Backend APIs)
```

### **Database: Supabase (aqpwfurradxbnqvycvkm)**
- Shared tables: products, market_orders, dealers, product_reviews, whatsapp_conversations
- Real-time subscriptions enabled
- RLS policies configured

### **Deployment: Vercel**
- URL: https://dloop.vercel.app
- Auto-deploy from GitHub master
- All environment variables configured

### **Integrations**
- **Twilio WhatsApp:** +39 328 1854639 (order notifications)
- **OpenAI ChatGPT:** Dealer support bot
- **Supabase Edge Functions:** whatsapp-notify (async)
- **Stripe:** NOT YET INTEGRATED ⚠️

---

## 📋 FEATURE COMPLETION STATUS

| Feature | Status | % | Priority |
|---------|--------|---|----------|
| Search & Filter (Category-First) | ✅ DONE | 100% | P0 |
| Product Catalog | ✅ DONE | 100% | P0 |
| Shopping Cart | ✅ DONE | 100% | P0 |
| Checkout Form | ✅ DONE | 100% | P0 |
| Order Tracking (Real-time) | ✅ DONE | 100% | P0 |
| Order History | ✅ DONE | 100% | P0 |
| Product Reviews | ✅ PARTIAL | 70% | P1 |
| WhatsApp Notifications | ✅ DONE | 100% | P0 |
| Dealer Signup | ✅ DONE | 100% | P0 |
| Dealer Dashboard | ✅ PARTIAL | 45% | P1 |
| Stripe Payment | ❌ TODO | 0% | P0 ⚠️ CRITICAL |
| Rider App (Flutter) | ✅ PARTIAL | 75% | P0 |
| Email Notifications | ❌ TODO | 0% | P1 |
| Push Notifications (FCM) | ❌ TODO | 0% | P1 |
| Payout System | ❌ TODO | 0% | P2 |
| KYC Verification | ❌ TODO | 0% | P2 |

---

## 🎨 UX/UI ANALYSIS

### **dloop-pwa (Customer) - 7.5/10**
**✅ Strong:** Clean design, responsive, clear user flow, category-first logic
**❌ Weak:** Stripe missing, reviews incomplete, no animations, product images sometimes fail
**Critical Gap:** Payment integration

### **dloop-landing (Dealer) - 6.5/10**
**✅ Strong:** Landing design solid, signup flow works, email verification
**❌ Weak:** Dashboard incomplete, no product management UI, no analytics
**Critical Gap:** Real dealer dashboard functionality

### **dloop_rider_prototype (Flutter) - 8/10**
**✅ Strong:** Modern Flutter, real-time updates, push notifications, support chat, gamification
**❌ Weak:** Pricing system incomplete, no QR scanning, no photo upload
**Critical Gap:** Firebase setup (google-services.json missing)

---

## 🚨 CRITICAL ISSUES (DO FIRST)

```
NEXT 3 MONTHS ROADMAP:

🔴 CRITICAL (MUST DO - Week 1-4)
├─ PWA: Stripe payment integration (Stripe Payment Feature - Feature 5)
├─ PWA: Email notifications (SendGrid/Resend)
├─ Landing: Dealer dashboard functionality (real product/order management)
├─ Landing: Payout system setup
└─ Rider: Firebase setup + google-services.json

🟡 IMPORTANT (Week 5-8)
├─ PWA: Product reviews modal wiring to orders
├─ PWA: Push notifications (FCM)
├─ Landing: KYC/AML verification
├─ Rider: Pricing tiers (feat/tariffe branch)
└─ Rider: QR code scanning + photo upload

🟢 NICE-TO-HAVE (Week 9-12)
├─ PWA: Referral program
├─ PWA: Seasonal promotions
├─ Landing: Analytics dashboard
└─ Rider: Enhanced gamification
```

---

## 💡 KEY DECISIONS

### **Architecture: Unified Codebase ✅**
- **Why:** Customer + Dealer share Supabase DB, single domain, atomic deployments
- **Revisit When:** If dealer growth massively exceeds customer growth (unlikely)

### **Tech Stack: Next.js 15 + Supabase + Flutter ✅**
- **Why:** Modern, scalable, real-time capable, good for MVP
- **Trade-off:** Not as simple as Firebase, but more flexible

### **Pricing Model: TBD**
- **Options:** Commission (15-20%), fixed fee, hybrid
- **Decide:** After first 10 dealers onboarded

### **Rider Acquisition: TBD**
- **Options:** In-house recruitment, gig platform partnership, employee model
- **Decision Point:** When volume requires >50 riders

---

## 📱 GO-TO-MARKET ROADMAP

```
MONTH 1 (NOW): MVP Hardening
└─ Fix: Stripe, email notifs, dealer dashboard
└─ Target: 10 dealers (friends/early believers)
└─ Metrics: 100 orders/week minimum

MONTH 2: Dealer Growth
└─ Recruit: 20-30 dealers (direct outreach)
└─ WhatsApp bot support full
└─ Revenue share clear (15% + delivery margin)
└─ Metrics: 1000 orders/week

MONTH 3: Customer Growth
└─ Marketing: Local paid ads (Facebook, Google)
└─ CAC Target: €3-5 per customer
└─ Target: 5000 monthly active users
└─ Metrics: 30% repeat rate, NPS > 40

MONTH 6: Scale or Pivot
└─ Assess: Unit economics, retention, margin
└─ Decision: Double down or pivot to B2B (white-label)
```

---

## 💰 UNIT ECONOMICS TARGETS

```
CUSTOMER SIDE:
- Order value: €25 average
- Commission: 15% = €3.75
- Marketing cost: €3-5 per new customer
- Repeat rate: 30% (3 orders/month after 3 months)
- LTV: €150+ (if retained)

DEALER SIDE:
- Sales per dealer/month: €500-1000 (MVP target)
- Commission to Dloop: €75-150/dealer/month
- Rider cost: €50-100/order (shared with customer)
- Dealer retention: >90% (sticky if working)

RIDER SIDE:
- Earnings per delivery: €3-5
- Deliveries per day: 8-12
- Daily earnings: €24-60
- Monthly: €500-1200
- Churn: 25-30%/month (industry standard)
```

---

## 📞 KEY CONTACTS & CREDENTIALS

**Supabase Project ID:** aqpwfurradxbnqvycvkm
**Vercel Project:** dloop (renamed from dloop-pwa)
**WhatsApp Bot:** +39 328 1854639 (Twilio)
**Active Dealers:** 4 (Toelettatura Pet, Piccolo Supermarket, NaturaSì, Yamamay)

---

## 🎓 LESSONS LEARNED (This Session)

1. **Category-First Logic Works:** Users think of category first, then dealer
2. **Unified Codebase = Simpler:** Dealer + Customer are interconnected (orders), so unifying was right call
3. **WhatsApp Bot > Email:** Dealers prefer WhatsApp, customers expect it
4. **Real-time Features Matter:** Order history + tracking drive retention
5. **Stripe is NOT Optional:** Payment integration is blocker for scaling
6. **Flutter Rider App is Strong:** Best-polished component (8/10)
7. **You Need a Team:** Solo scaling to 100 dealers is near impossible

---

## ⚠️ BIGGEST RISKS

1. **Glovo War (80% probability):** If you succeed, Glovo will copy locally or acquire
2. **Rider Churn (70%):** Hard to keep riders, margin pressure
3. **Dealer Acquisition Costs (60%):** Getting dealers to switch is expensive
4. **Unit Economics Break (50%):** Margins might not work at scale
5. **Founder Burnout (40%):** Solo building AND managing dealers is hard

---

## 🎯 SUCCESS DEFINITION

**MVP Success:** 10 dealers, 1000 orders/month, positive unit economics
**Series A Ready:** 100 dealers, 100k orders/month, €1M ARR
**Exit Opportunity:** Glovo/JustEat acquisition at €10M+ valuation

---

## 📚 DOCS TO READ

- `DEALER_ONBOARDING.md` - Dealer signup/dashboard spec
- `WEBHOOK_DEPLOYMENT.md` - WhatsApp bot deployment
- `.env.local` - All credentials (keep secret!)

---

**Last Updated:** 2026-03-01 23:59
**Next Review:** 2026-03-15 (after Stripe implementation)
**Maintainer:** Solo founder (you!)

---

*This is your north star. Reference it daily. Update it weekly.*

🚀 **Let's go build something great!**
