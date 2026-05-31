# VaultPay Financial Core — Prompt Engineering Guide

This document contains the step-by-step human prompts that can be used to architect and build this enterprise-grade FinTech application from scratch. It serves as a learning resource for collaborating with AI on complex software engineering tasks.

---

## Phase 1: Architecture & Foundation
**Prompt:**
> "Act as a Senior FinTech Frontend Engineer. I want to build a commercial-grade financial portal called 'VaultPay Financial Core' using Next.js 14 (App Router), TypeScript, Tailwind CSS, and Zustand. 
> 
> The application handles money, so strict security, Role-Based Access Control (RBAC), and financial transaction safety are the top priorities. Please outline the architecture, initialize the project structure, and configure Tailwind CSS with premium dark-mode banking design tokens (deep navy, glassmorphism, glowing status badges)."

---

## Phase 2: Security & RBAC Implementation
**Prompt:**
> "Let's implement the Role-Based Access Control (RBAC). Create two roles: `Admin` and `Client`. 
> 
> 1. Create a centralized Permission Matrix. Admins can view all invoices and create invoices. Clients can only view and pay their own invoices.
> 2. Create Next.js Edge Middleware to strictly enforce route boundaries. If a Client tries to access any `/admin/*` route, intercept the request and redirect them to a custom `/403` Access Denied page.
> 3. Create a secondary client-side layout guard to prevent unauthorized rendering in the React tree."

---

## Phase 3: Global State & Idempotency Lock
**Prompt:**
> "Now set up the Zustand state management. We need three stores:
> 1. `authStore`: Manages user login state, role, and derives permissions. Persist this to localStorage.
> 2. `invoiceStore`: Manages the list of invoices.
> 3. `paymentStore`: This is critical. Create a hard boolean lock (`processing: true/false`) to ensure transaction idempotency. We must guarantee that a user can never accidentally click 'Pay' twice and trigger duplicate charges."

---

## Phase 4: Mock Data & UI Components
**Prompt:**
> "Create a robust mock data layer with 8 realistic invoices ranging from $5,000 to $48,000 across two distinct clients. 
> 
> Then, build the core UI components using our Tailwind design tokens:
> - A reusable `Card` and `StatusBadge` (Paid, Pending, Overdue).
> - An `InvoiceTable` that is sortable and filterable.
> - A `RevenueWidget` for the admin dashboard that visualizes the pipeline (Collected, Pending, Overdue) using a segmented progress bar.
> - Shimmer-based skeleton loaders for smooth loading states."

---

## Phase 5: The Payment Engine
**Prompt:**
> "Build the `PayButton` component. This must be a highly robust, idempotent component.
> 
> 1. Tie it to the Zustand `paymentStore` lock. If `processing` is true, disable the button immediately at the HTML level.
> 2. Build a simulated payment flow that uses `react-hot-toast` to show state transitions: 'Processing...' -> 'Payment Successful!'.
> 3. Also write the server-side Next.js API route (`/api/create-checkout-session`) for a real Stripe Checkout integration, but ensure the UI falls back gracefully to the mock simulation if Stripe API keys are missing."

---

## Phase 6: Pages & Dashboards
**Prompt:**
> "Let's assemble the pages. 
> 
> 1. Build the `/login` page with two 'Demo Quick Access' buttons so users can instantly log in as either an Admin or a Client without typing passwords.
> 2. Build the Admin Dashboard (`/admin/dashboard`) showing the Revenue Widget, total KPI stats cards, and the full invoice table.
> 3. Build the Client Dashboard (`/client/dashboard`) showing their outstanding balance and only THEIR invoices. 
> 4. Ensure that the data fetching strictly filters invoices by `clientId` when a Client is logged in so data isolation is perfectly maintained."

---

## Phase 7: Document Generation
**Prompt:**
> "Build the Invoice Detail page (`/client/invoices/[id]`) showing the breakdown of charges and the Pay button. 
> 
> Add a 'Download PDF' button. Write a Next.js API route that uses `@react-pdf/renderer` to generate a professional PDF receipt on the server and downloads it to the user's browser natively. Include a plain-text fallback if the PDF engine fails."

---

## Phase 8: Final Polish & Deployment
**Prompt:**
> "Review the application for enterprise readiness. Ensure all TypeScript types are strict and correct. Add a `next-env.d.ts` and update `next.config.js` to handle any build warnings. 
> Create a comprehensive `README.md` and prepare the application for production deployment on Vercel."
