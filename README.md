# Kwatcha — MSE Trade Frontend

A modern, dark-themed trading platform for the **Malawi Stock Exchange (MSE)**. Built with Next.js 16 (App Router), React 19, and Tailwind CSS v4.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4, Lucide React icons
- **Charts:** Recharts
- **UI Components:** shadcn/ui (Button, Card)
- **Auth:** localStorage-based (placeholder — no JWT yet)
- **Backend API:** `https://kwatcha-api-production.up.railway.app`

---

## Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page — hero, market snapshot, company cards |
| `/pages/Market` | Full market listing — sortable/filterable table, top movers |
| `/pages/DashboardPage` | Authenticated dashboard — market stats, gainers/losers |
| `/pages/Portfolio` | Portfolio holdings with live P&L and order history |
| `/pages/AccountCreationPage` | 6-step CSD account opening form |
| `/pages/[ticker]` | Individual stock page — chart, order panel, company tabs |

---

## Project Structure

```
kwatcha-fe/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                     # Landing page
│   └── pages/
│       ├── Market/page.tsx          # Market listing
│       ├── DashboardPage/page.tsx   # Dashboard
│       ├── Portfolio/page.tsx       # Portfolio
│       ├── AccountCreationPage/page.tsx
│       └── [ticker]/page.tsx        # Individual stock
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── StockRow.tsx                 # Used in MarketPage
│   ├── StockDetail.tsx              # Used in MarketPage
│   └── ui/
│       ├── button.tsx
│       └── card.tsx
├── lib/
│   ├── apiFetch.ts                  # Fetch wrapper with error handling
│   ├── companyData.ts               # Static company info per ticker
│   └── utils.ts
└── types/
    └── market.ts                    # Shared API types
```

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To point at local backend instead of production, swap the API base URL in each page to `http://127.0.0.1:8000`.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/stocks` | All listed stocks with OHLCV data and history |
| `GET` | `/stocks/movers` | Top gainers and losers |
| `GET` | `/history/{ticker}` | Price history for a specific stock |
| `POST` | `/orders` | Place a buy/sell order |
| `POST` | `/login` | Authenticate a user |
| `POST` | `/create_account` | Submit CSD account application (multipart) |

---

## Known Limitations & Technical Debt

### High Priority
- **Code duplication** — Market status calculation (`calcMarketStatus`), gradient backgrounds, stock change color logic, and data fetching patterns are each duplicated across 3–5 files. These should be extracted to shared utilities and custom hooks.
- **Monolithic pages** — `[ticker]/page.tsx` (592 lines) and `AccountCreationPage/page.tsx` (844 lines) bundle data fetching, business logic, and rendering in single files. Each should be broken into sub-components and hooks.
- **Scattered type definitions** — `StockData`, `MarketResponse`, etc. are redefined in multiple pages instead of imported from `types/market.ts`.
- **Hardcoded API URL** — The production API base URL is repeated 10+ times. Should be a single `NEXT_PUBLIC_API_BASE_URL` environment variable.

### Medium Priority
- **Auth is a stub** — `mse_user` in localStorage is a boolean flag, not a real session. No JWT, no token expiry.
- **Portfolio is mock data** — Holdings and order history are hardcoded constants, not fetched from a database yet.
- **No request caching** — Each page fetches `/stocks` independently with no deduplication or stale-while-revalidate.
- **Orphaned components** — `StockRow.tsx` and `StockDetail.tsx` are defined but not imported anywhere.

### Low Priority
- No automated tests
- No error boundaries (a single component crash can blank the page)
- No analytics or performance monitoring
