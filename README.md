# VaultPay Financial Core 🏦

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-State_Management-yellow?style=for-the-badge)
![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=Stripe&logoColor=white)

VaultPay Financial Core is a commercial-grade, secure financial portal designed for enterprise invoice management and client billing. Built with a focus on strict security, data isolation, and user trust, it features robust Role-Based Access Control (RBAC), idempotent Stripe payment workflows, and server-side PDF generation.

**Live Demo:** [vaultpay-financial-core-alpha.vercel.app](https://vaultpay-financial-core-alpha.vercel.app/)

---

## 🚀 Key Features

*   **Strict Role-Based Access Control (RBAC):** Two distinct user roles (Admin & Client) enforced at the network edge via Next.js Middleware, ensuring absolute data isolation.
*   **Idempotent Payment Engine:** A custom Zustand state lock physically prevents duplicate transactions and race conditions during payment processing.
*   **Secure Stripe Integration:** Server-side Stripe Checkout session generation keeps sensitive card data completely off our servers (PCI DSS compliant).
*   **Server-Side Document Generation:** Dynamic, on-the-fly PDF invoice generation using `@react-pdf/renderer` via dedicated Next.js API routes.
*   **Premium Banking UI:** A highly polished, responsive dark-mode interface built with Tailwind CSS, featuring glassmorphism, glowing status badges, and shimmer-based skeleton loaders.
*   **Interactive Dashboards:** Comprehensive revenue tracking, outstanding balance calculations, and sortable/filterable invoice tables.

---

## 🛠️ Technology Stack

*   **Framework:** Next.js 14 (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS v3
*   **State Management:** Zustand (with localStorage persistence)
*   **Payments:** Stripe Checkout
*   **Notifications:** React Hot Toast
*   **Icons:** Lucide React
*   **PDF Generation:** `@react-pdf/renderer`

---

## 🔒 Security Architecture

Security is the primary directive of this application:

1.  **Edge-Level Protection:** `middleware.ts` intercepts requests before they hit the React tree, redirecting unauthorized users attempting to access `/admin/*` routes to a strict `403 Access Denied` page.
2.  **Client-Side Guards:** Layout-level redundant safety checks provide a second layer of defense.
3.  **Data Isolation:** Invoice queries are strictly filtered by `clientId` at the data-fetching layer; a client cannot view another client's data, even with a direct URL.
4.  **Transaction Safety:** The `PayButton` uses a centralized Zustand lock (`processing: true`) that disables the button at the DOM level instantly upon click, eliminating double-charge vulnerabilities.

---

## 🚦 Getting Started

### Prerequisites
*   Node.js 20+
*   npm or yarn

### Local Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/abhay-chayal/VaultPay-Financial-Core.git
    cd "VaultPay-Financial-Core"
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    The app runs in a fully functional mock mode without keys. However, for real Stripe integration, create a `.env.local` file:
    ```env
    # Fallback placeholders are provided in the app if these are omitted
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
    STRIPE_SECRET_KEY=sk_test_...
    NEXT_PUBLIC_APP_URL=http://localhost:3000
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Demo Instructions

The application includes a seamless demonstration mode. On the `/login` page, use the **Demo Quick Access** buttons:

*   **Admin Demo:** Logs in as Sarah Mitchell. Gains full system access, views global revenue metrics, and can manage all invoices.
*   **Client Demo:** Logs in as Alex Thompson. Only sees his own outstanding balance and invoices. Try navigating to `http://localhost:3000/admin/dashboard` as the client to witness the edge middleware 403 redirect in action.

---

## 📚 Learning Resources

Check out [Prompts.md](./Prompts.md) in this repository. It contains the step-by-step human prompts used to architect, design, and build this application alongside an AI assistant, serving as a masterclass in AI-assisted engineering.

---
*Built with precision for commercial FinTech standards.*
