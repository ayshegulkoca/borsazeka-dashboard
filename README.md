# BorsaZeka Dashboard

An enterprise-grade, high-performance FinTech workspace designed for automated trading management, secure broker API synchronization, and remote VPS infrastructure monitoring.

Built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**, this platform bridges the gap between landing page catalog interactions and secure exchange executions with real-time feedback.

---

# Technical Stack

| Category           | Technology                                          |
| ------------------ | --------------------------------------------------- |
| Frontend Framework | Next.js 15+ (App Router, SSR & Client Components)   |
| Language           | TypeScript                                          |
| Styling & Theme    | Tailwind CSS, Custom Royal Obsidian Design Language |
| Database & ORM     | PostgreSQL (Neon Serverless) + Prisma ORM           |
| Authentication     | NextAuth.js (Auth.js v5) + Google OAuth             |
| Session Management | Refresh Tokens + Sliding Session Expiration         |

---

# Core Features & Engineering Solutions

## 1. Unified Onboarding Wizard

A modular **6-step onboarding workflow** guiding users through:

* Robot selection
* Server configuration
* Broker credential binding
* Payment setup

Both the Landing Page and Dashboard share the same synchronized progress-tracking system to reduce onboarding friction.

---

## 2. Secure Broker Integration & Communication

### Strict Numeric String Transmission

To prevent precision loss on large numeric identifiers:

```ts
/^\d+$/
```

Fields such as:

* accountNo
* subAccountNo

are validated and transmitted strictly as strings.

### AES-256 Security Layer

Sensitive credentials such as:

* API Keys
* Broker Passwords

are protected through client-side encryption warnings and visual security indicators.

### Cached Database Metadata

The database never stores:

* Raw API Keys
* Trade Execution Passwords

Instead, only metadata is cached:

* Institution Name
* Masked Account Number
* Active Robot Name

---

## 3. Dynamic Balance Caching Strategy

### Problem

Directly querying broker APIs on every dashboard refresh causes:

* Network latency
* Rate limiting
* Poor user experience

### Solution

Balances are cached inside PostgreSQL and served through:

```http
/user/dashboard-summary
```

### UI Privacy Controls

Users can instantly hide or reveal balance information using:

* Eye
* EyeOff

visibility toggles without triggering new API requests.

---

## 4. Responsive Viewport Optimization

### The 100% Zoom Bug Fix

The dashboard layout was rebuilt using:

```css
lg:grid-cols-3
```

Benefits:

* Preserved typography hierarchy
* Stable button alignment
* No overlapping components
* Improved desktop usability

---

## 5. Iframe Overlay Protection

### Problem

Third-party iframes may inject:

* Advertisements
* Public user images
* Unwanted visual elements

### Solution

A CSS overlay mask is positioned above the iframe media layer.

Implementation highlights:

```css
position: absolute;
pointer-events: none;
```

This preserves:

* Branding consistency
* Click functionality
* Navigation behavior

---

## 6. Stripe Pre-filled Checkout Pipeline

Authenticated Google user emails are automatically injected into checkout URLs.

### Stripe Test Mode

| Field           | Value               |
| --------------- | ------------------- |
| Card Number     | 4242 4242 4242 4242 |
| Expiration Date | Any future date     |
| CVC             | 123                 |
| Postal Code     | 34000               |

---

# Project Structure

```text
├── prisma/
│   └── schema.prisma
│
├── auth.config.ts
│
├── src/
│   ├── app/
│   │   ├── actions/
│   │   │   └── broker.ts
│   │   │
│   │   └── dashboard/
│   │
│   ├── data/
│   │   └── products.ts
│   │
│   └── lib/
│       ├── api.ts
│       └── stripe.ts
```

### Important Files

| File           | Purpose                             |
| -------------- | ----------------------------------- |
| schema.prisma  | Database schemas                    |
| auth.config.ts | OAuth & JWT handling                |
| broker.ts      | Broker registration & persistence   |
| products.ts    | Stripe pricing configuration        |
| api.ts         | API client and token refresh engine |
| stripe.ts      | Checkout URL generation             |

---

# Installation

## 1. Install Dependencies

```bash
npm install
```

---

## 2. Configure Environment Variables

Create:

```bash
.env
```

or

```bash
.env.local
```

```env
# PostgreSQL
DATABASE_URL="postgresql://username:password@hostname:port/database?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="your_generated_secret_key"
NEXTAUTH_URL="http://localhost:3000"

# Auth.js
AUTH_SECRET="your_generated_secret_key"
AUTH_URL="http://localhost:3000/api/auth"

# Google OAuth
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

```

---

## 3. Generate Prisma Client

```bash
npx prisma generate
```

---

## 4. Start Development Server

```bash
npm run dev
```

Application URL:

```text
http://localhost:3000
```

---

# Security & Compliance

BorsaZeka follows strict security boundaries:

* No sensitive credentials stored in browser local storage
* No raw broker passwords persisted in the database
* SSL-secured database connections
* Cryptographically signed JWT sessions
* Automatic token refresh mechanisms
* Metadata-only persistence strategy

Database connections enforce:

```env
sslmode=require
```

to guarantee encrypted communication with PostgreSQL infrastructure.

---

# Architecture Highlights

* Next.js 15 App Router
* TypeScript Strict Mode
* Prisma ORM
* Neon PostgreSQL
* Google OAuth
* JWT Session Rotation
* Stripe Integration
* Broker API Synchronization
* VPS Monitoring
* Responsive Dashboard Workspace
* Enterprise Security Standards
