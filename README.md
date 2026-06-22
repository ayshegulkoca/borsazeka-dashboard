BorsaZeka Dashboard

An enterprise-grade, high-performance FinTech workspace designed for automated trading management, secure broker API synchronization, and remote VPS infrastructure monitoring. Built with Next.js 15, TypeScript, and Tailwind CSS, this platform bridges the gap between landing page catalog interactions and secure exchange executions with real-time feedback.

Technical Stack

Frontend Framework: Next.js 15+ (App Router, leveraging Server-Side Rendering (SSR) and dynamic Client Components)

Language: TypeScript (Strict type safety across API integrations and broker payload handling)

Styling & Theme: Tailwind CSS & responsive CSS utility variables (Custom Royal Obsidian Design Language)

Database & ORM: PostgreSQL (Neon Serverless backend) and Prisma ORM

Authentication & Session: NextAuth.js (Auth.js v5) with Google OAuth integration, token rotation (refresh tokens), and sliding-window expiration management

Core Features & Engineering Solutions

1. Unified Onboarding Wizard

A seamless, modular 6-step interactive workflow guiding clients through robot selection, server configurations, secure broker credentials binding, and payment setups. This setup guarantees that both the public Landing Page and the secure user Dashboard share an identical, synchronized progress tracking system to reduce onboarding friction.

2. Secure Broker Integration & Communication

Strict Numeric String Transmission: To eliminate potential precision loss on large integers handled by JavaScript on the client side, sensitive numerical parameters like accountNo and subAccountNo are validated using strict regex (/^\d+$/) and transmitted solely as strict string objects.

AES-256 Client-Side Protection: High-security integration parameters (API keys, passwords) utilize client-side AES-256 encryption warnings to build user trust, accompanied by a clean visual "Shield Warning Banner."

Cached Database Metadata: To ensure robust data privacy, the PostgreSQL database (BrokerAccount model) does not store raw API keys or trade execution passwords. It only caches structural meta-information (e.g., Institution name, masked account numbers, activated robot name) for display verification inside the UI.

3. Dynamic Balance Caching Strategy

Avoiding Synchronous Broker Loops: Continuous, real-time polling to external broker live APIs on every dashboard refresh induces severe network latency and triggers provider rate-limiting.

PostgreSQL Fast Cache: User overall balances are calculated and cached securely inside the database, served instantly via a lightning-fast /user/dashboard-summary endpoint.

React State Visibility: A local toggleable state (Eye/EyeOff button) allows users to mask or reveal their account metrics instantly on the client UI without redundant network queries.

4. Responsive Viewport Optimization (The 100% Zoom Bug Fix)

Layout Grid Reconstruction: The crowded layout on standard screens has been dismantled. The workspace has been rebuilt using a hardware-accelerated 3-column fluid grid layout (lg:grid-cols-3) to protect typographic hierarchy, preserve button alignments, and eliminate component overlaps at 100% zoom.

5. Iframe Overlay Protection (Visual Noise Patch)

Click-Through CSS Masking: External third-party iframe widgets often inject unwanted advertisements or unapproved public user images that degrade brand consistency.

Seamless Overlay: Since browser cross-origin policies block modifying DOM elements inside external iframes directly, an absolute-positioned CSS mask was engineered directly over the target media container. This overlays the BorsaZeka branding mark on the visual noise while using pointer-events-none to keep underlying click triggers and navigation fully functional.

6. Stripe Pre-filled Checkout Pipeline

Matching Authentication Entities: The getPrefilledStripeLink utility automatically extracts and locks the authenticated Google user's email within the checkout URL, ensuring that subscription logs strictly match the portal profile.

Developer Sandbox: Integrated Stripe Test Mode parameters for billing testing and simulation:

Card Number: 4242 4242 4242 4242

Expiration Date: Any date in the future (e.g., 12/30)

CVC: 123

Postal Code: 34000

Directory Mapping & Project Structure

The critical codebase boundaries and schemas are distributed across the following architectural structure:

├── prisma/
│   └── schema.prisma        # PostgreSQL database schemas (User, BrokerAccount, Server, UserRobot)
├── auth.config.ts           # Google OAuth, token handshake and sliding JWT refresh algorithms
├── src/
│   ├── app/
│   │   ├── actions/
│   │   │   └── broker.ts    # Server actions coordinating broker registration and DB persistence
│   │   └── dashboard/       # Responsive layouts, workspace screens, and user settings
│   ├── data/
│   │   └── products.ts      # Premium tier pricing indices and pre-configured Stripe URLs
│   └── lib/
│   │   ├── api.ts           # Unified apiFetch engine, token auto-refresh, and 401 interception
│   │   └── stripe.ts        # Stripe URL generation and secure email pre-fill helpers


Installation & Local Development Guidelines

Follow these commands to deploy a local instance of the BorsaZeka Dashboard:

1. Install Project Dependencies

npm install


2. Configure Environment Variables

Create a .env (or .env.local for development environments) file in the root directory. Follow this template:

# Relational Database Connection (Neon PostgreSQL or Local Server)
DATABASE_URL="postgresql://username:password@hostname:port/database?sslmode=require"

# NextAuth Authorization Keys (Generate with: openssl rand -hex 32)
NEXTAUTH_SECRET="your_generated_secret_key"
NEXTAUTH_URL="http://localhost:3000"

# Alternative Auth.js Keys
AUTH_SECRET="your_generated_secret_key"
AUTH_URL="http://localhost:3000/api/auth"

# Google Developer Console Credentials
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# BorsaZeka Remote API Service Address
NEXT_PUBLIC_API_BASE_URL="http://api.borsazeka.com:5072/api"


3. Generate Prisma DB Client

Compile database models and map relationships into the local node modules:

npx prisma generate


4. Run the Development Server

npm run dev


The application will be accessible inside your browser at http://localhost:3000.

Security & Compliance Standard

To guarantee data confidentiality, BorsaZeka structures web operations using strict boundaries. Sensitive credentials never persist in browser state or local storage. Database connections utilize secure parameters (sslmode=require), and session tracking employs cryptographically signed JSON Web Tokens (JWT) rotating dynamically prior to expiry limits.
