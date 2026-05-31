# VaultPay Financial Core — Presentation Notes

## Project Overview

**VaultPay Financial Core** is a commercial-grade FinTech portal that demonstrates:
- Role-Based Access Control (RBAC) with two distinct user types
- Secure payment processing via Stripe Checkout
- Real-time invoice management with PDF generation
- Enterprise security patterns and UX

---

## Demo Credentials

| Role  | Email                  | Password   | Access Level |
|-------|------------------------|------------|--------------|
| Admin | admin@vaultpay.io      | admin123   | Full system  |
| Client| alex@techcorp.io       | client123  | Own invoices |
| Client| maria@designstudio.io  | client456  | Own invoices |

> Use the **Quick Access buttons** on the login page for one-click demo login.

---

## Demo Script — 6 Scenarios

### Scenario 1: Admin Login & Dashboard

1. Navigate to `http://localhost:3000`
2. Click **"Admin Demo"** button (Sarah Mitchell)
3. Observe: Lands on `/admin/dashboard`
4. **Point out:**
   - Role badge: `ADMIN` (gold)
   - Revenue pipeline widget with Paid/Pending/Overdue breakdown
   - KPI stats: Total Revenue, Collected, Pending, Overdue
   - Full invoice table showing ALL clients

**Key message:** Admin has complete visibility across the entire platform.

---

### Scenario 2: Client Login & Dashboard

1. Click "Sign Out"
2. Click **"Client Demo"** button (Alex Thompson)
3. Observe: Lands on `/client/dashboard`
4. **Point out:**
   - Role badge: `CLIENT` (blue)
   - Only sees **own** invoices (filtered by `clientId`)
   - Outstanding balance card
   - No access to admin navigation items

**Key message:** Data isolation — clients can never see each other's invoices.

---

### Scenario 3: RBAC Blocking (Unauthorized Access Attempt)

1. While logged in as **Client**, navigate manually to:
   `http://localhost:3000/admin/dashboard`
2. Observe: **Instant redirect to `/403`**
3. **Point out:**
   - Professional 403 page with pulsing warning icon
   - "Access attempt has been logged" message
   - Two-layer protection: Edge middleware + client-side layout guard
   - Cannot be bypassed by direct URL entry

**Key message:** Security is enforced at the network edge, not just the UI.

---

### Scenario 4: Invoice Payment Flow

1. Log in as **Client** (Alex Thompson)
2. Navigate to **My Invoices** → click **View** on any Pending invoice
3. Observe the Invoice Detail page:
   - Invoice number, amount, due date, status
   - Client information card
   - Payment summary breakdown
4. Click **Pay Invoice**
5. **Point out:**
   - Button immediately disabled + spinner shows
   - Toast: "Payment Processing..."
   - Cannot be clicked twice (Zustand `processing` lock)

**Key message:** Financial transaction safety — zero possibility of duplicate charges.

---

### Scenario 5: Stripe Checkout Flow

1. If Stripe keys are configured in `.env.local`:
   - Clicking Pay Invoice opens **Stripe Checkout** (hosted, off-site)
   - After payment: redirected to `/payment-success`
2. In demo mode (no keys):
   - Simulates 2-second processing delay
   - Shows success/failure toast
   - Invoice status updates to **Paid** in real-time
   - Redirected to `/payment-success`
3. **Point out:**
   - Payment states: idle → loading → success/failed
   - Toast notifications at each state

**Key message:** Stripe Checkout is off-site — card data never touches our server.

---

### Scenario 6: PDF Download

1. Navigate to any invoice detail page
2. Click **Download PDF**
3. Observe:
   - Button shows loading spinner while generating
   - PDF (or text file in demo) downloads automatically
   - Native browser download dialog
4. **Point out:**
   - API route at `/api/invoices/[id]/pdf`
   - Uses `@react-pdf/renderer` for real PDFs
   - Falls back gracefully to plain text in demo mode

**Key message:** Document vault — clients can always access their invoice records.

---

## Architecture Highlights

### Security Layers (Talk Track)

```
Layer 1: Edge Middleware (middleware.ts)
  → Runs before any page renders
  → Reads auth cookie, checks role
  → Redirects /admin/* for non-admins

Layer 2: Layout Guards (admin/layout.tsx, client/layout.tsx)
  → Client-side Zustand auth check
  → Second line of defense

Layer 3: Data Access Control (useInvoices.ts)
  → Clients always filtered by clientId
  → Impossible to fetch another client's data

Layer 4: Payment Idempotency (PayButton.tsx + paymentStore.ts)
  → Hard boolean lock in Zustand
  → Button physically disabled on first click
  → No race condition possible
```

### State Management (Zustand)

| Store | Purpose |
|-------|---------|
| `authStore` | User, role, permissions — persisted to localStorage |
| `invoiceStore` | Invoices list, loading, selected invoice |
| `paymentStore` | Payment status, processing lock |

---

## Business Value Demonstration

- **Trust**: Role badges, security notices, professional UI build user confidence
- **Safety**: Double-payment prevention protects business financially
- **Compliance**: PCI DSS awareness (Stripe off-site), audit trail concept
- **Scale**: RBAC framework scales to any number of roles/permissions

---

## Technical Stack Summary

| Technology | Purpose |
|------------|---------|
| Next.js 14 App Router | Framework, routing, API routes |
| TypeScript | Type safety across the entire codebase |
| Tailwind CSS | Design system with banking tokens |
| Zustand | Lightweight global state + persistence |
| Firebase Auth | Production authentication (demo: mock) |
| Stripe Checkout | PCI-compliant payment processing |
| React Hot Toast | User feedback notifications |
| @react-pdf/renderer | Server-side PDF generation |
| Lucide React | Consistent icon library |
