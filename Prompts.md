# VaultPay Financial Core — AI-Assisted Engineering Documentation

This document records the AI-assisted engineering decisions made during the development of VaultPay Financial Core. It covers architecture, patterns, security design, and rationale.

---

## 1. RBAC Architecture

### Prompt / Problem
> "Design a role-based access control system for a FinTech app with Admin and Client roles. Clients must never access admin routes or see other clients' data."

### AI Engineering Decisions

**Permission Matrix Pattern**
```typescript
// lib/rbac.ts
const PERMISSIONS: Record<Role, Permission> = {
  admin:  { canViewAllInvoices: true,  canPayInvoice: false, ... },
  client: { canViewAllInvoices: false, canPayInvoice: true,  ... },
};
```
- Chose a declarative permission matrix over scattered `if/else` checks
- Each action is explicitly allowed/denied per role — easy to audit
- Adding new roles requires only a new entry in the matrix

**Two-Layer Guard Pattern**
- **Layer 1**: Next.js Edge Middleware (`middleware.ts`) — runs before any render, reads cookie, redirects at the network level. This cannot be bypassed by JavaScript manipulation.
- **Layer 2**: Layout-level client guard (`admin/layout.tsx`) — redundant safety check on the React tree. Catches edge cases where middleware might be bypassed (e.g., cached responses).

**Why two layers?**
Financial applications must assume the middleware can fail. Defense in depth means the UI also validates role independently.

---

## 2. Stripe Integration Architecture

### Prompt / Problem
> "Integrate Stripe Checkout with safety — prevent duplicate payments, handle all states, and make it work in demo mode without real keys."

### AI Engineering Decisions

**Stripe Checkout vs Elements**
- Chose hosted **Stripe Checkout** (redirect model) over Stripe Elements (embedded card form)
- Rationale: Card data never touches our server → automatic PCI DSS compliance, no card storage risk
- Stripe manages the payment form, fraud detection, and 3DS authentication

**API Route Design**
```typescript
// app/api/create-checkout-session/route.ts
// Validates input → creates session → returns URL
// Stripe secret key is server-only (never exposed to browser)
```

**Demo Mode Fallback**
```typescript
// PayButton.tsx
if (!stripeKey || stripeKey.includes('your_')) {
  // Simulate 2s payment with 90% success rate
  // No real money involved
}
```
- Allows full UI demonstration without Stripe credentials
- Same UX, same state transitions, same toasts

---

## 3. Route Guard Implementation

### Prompt / Problem
> "Protect /admin/* routes so clients cannot access them even by direct URL navigation."

### AI Engineering Decisions

**Edge Middleware Cookie Strategy**
```typescript
// middleware.ts
const authCookie = request.cookies.get('vaultpay-auth');
const parsed     = JSON.parse(decodeURIComponent(authCookie.value));
const role       = parsed?.state?.role;
```
- Zustand's `persist` middleware writes to `localStorage`
- Login page also writes the same data to a cookie for middleware access
- Cookie is `SameSite=Strict` to prevent CSRF-based cookie theft

**Why not use Firebase session cookies in demo?**
- Firebase Admin SDK requires server-side credentials not available in demo mode
- Cookie-based approach is equivalent for demonstration purposes
- Production implementation would use `firebase-admin` to verify ID tokens

---

## 4. PDF Download Flow

### Prompt / Problem
> "Download invoice PDFs with a loading state, using a backend endpoint and native browser download."

### AI Engineering Decisions

**Server-Side PDF Generation**
```typescript
// app/api/invoices/[id]/pdf/route.ts
// Uses @react-pdf/renderer on the server
// Returns Buffer → NextResponse with Content-Disposition: attachment
```
- PDF rendered on server (not client) — no sensitive data leak in JavaScript bundle
- `next.config.js` marks `@react-pdf/renderer` as external to prevent bundling issues

**Native Browser Download Trigger**
```typescript
const blob = await res.blob();
const url  = URL.createObjectURL(blob);
const a    = document.createElement('a');
a.href = url; a.download = `${invoice.invoiceNumber}.pdf`;
a.click();
URL.revokeObjectURL(url);  // Memory cleanup
```
- No `<a>` element left in the DOM — cleaned up immediately
- `revokeObjectURL` prevents memory leaks

**Fallback Chain**
1. Try real PDF via API route
2. If API fails → generate plain text stub in browser

---

## 5. Payment Protection Logic

### Prompt / Problem
> "Prevent duplicate payment submissions. A user must not be able to click Pay Invoice twice."

### AI Engineering Decisions

**Zustand Processing Lock**
```typescript
// store/paymentStore.ts
interface PaymentState {
  processing: boolean;   // Hard lock
}

startPayment: (invoiceId) => set({ processing: true, paymentStatus: 'loading' });
```
- `processing` flag is set synchronously on first click
- Even if React re-renders before the async call starts, the second click check `if (processing) return` fires
- This is different from a `useState` — Zustand state is external to React's render cycle, making it immune to race conditions from concurrent renders

**Button Disabled Pattern**
```typescript
<button
  onClick={handlePayment}
  disabled={processing || invoice.status === 'Paid'}
  aria-disabled={isDisabled}
/>
```
- `disabled` attribute physically prevents native click events (browser-level)
- `aria-disabled` signals to screen readers
- Both conditions: `processing` (in-flight) AND `status === 'Paid'` (already paid)

**Payment State Machine**
```
idle → (click) → loading → success → [redirect to /payment-success]
                         → failed  → [auto-reset after 3s] → idle
```

---

## 6. Data Isolation (Cross-Client Security)

### Prompt / Problem
> "Clients must never see invoices belonging to other clients."

### AI Engineering Decisions

**Client-ID Filtering**
```typescript
// hooks/useInvoices.ts
const clientId = role === 'client' ? user.uid : undefined;
fetchInvoices(clientId);  // undefined = admin mode (all invoices)

// store/invoiceStore.ts
const filtered = clientId
  ? all.filter((inv) => inv.clientId === clientId)
  : all;
```

**URL-Level Check** (Invoice Detail Page)
```typescript
// app/client/invoices/[id]/page.tsx
if (role === 'client' && inv.clientId !== user.uid) {
  router.replace('/403');
}
```
- Even if a client knows another invoice's ID and types the URL directly, they get 403'd
- This is defense layer 3 after middleware and layout guards

---

## 7. State Persistence Strategy

### Prompt / Problem
> "Preserve login state across page refreshes without a full backend session."

### AI Engineering Decisions

**Selective Zustand Persistence**
```typescript
persist(
  ...,
  {
    name: 'vaultpay-auth',
    partialize: (state) => ({
      user:   state.user,    // Persist: needed for auth state
      role:   state.role,    // Persist: needed for route guards
      isDemo: state.isDemo,  // Persist: mode flag
      // DO NOT persist: isLoading (always starts false)
      // DO NOT persist: permissions (derived from role on read)
    }),
  }
)
```
- Persisting `isLoading` would cause a stuck loading state on next load
- `permissions` are re-derived from `role` via `PERMISSIONS[role]` — no staleness risk

---

## Summary of Engineering Patterns

| Pattern | Location | Purpose |
|---------|----------|---------|
| Permission Matrix | `lib/rbac.ts` | Declarative, auditable RBAC |
| Edge Middleware Guard | `middleware.ts` | Network-level route protection |
| Layout Guard | `admin/layout.tsx` | React-level redundant protection |
| Zustand Processing Lock | `store/paymentStore.ts` | Race-condition-proof payment guard |
| clientId Filtering | `hooks/useInvoices.ts` | Data isolation at fetch level |
| URL-Level Auth Check | `client/invoices/[id]/page.tsx` | Direct URL access protection |
| Cookie + Zustand Sync | `app/login/page.tsx` | Middleware-accessible auth state |
| Demo Mode Fallback | `PayButton.tsx`, PDF route | Full demo without live credentials |
