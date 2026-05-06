# Think Shop 💡

E-commerce frontend built with **Next.js 15**, **React 18**, **TypeScript** and **Zustand** — following **Atomic Design** pattern.

## Stack

| Layer | Tool |
|-------|------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| State | Zustand (with persist middleware) |
| Styling | Global CSS with custom design tokens |
| Architecture | Atomic Design |

## Project Structure

```
thinkshop/
├── app/                        # Next.js App Router pages (logic only)
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home
│   ├── cart/page.tsx
│   ├── login/page.tsx
│   ├── account/page.tsx
│   ├── orders/page.tsx
│   └── product/[id]/page.tsx
│
├── components/
│   ├── atoms/                  # Smallest reusable units
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Logo.tsx
│   │   ├── ProductImage.tsx
│   │   └── StarRating.tsx
│   │
│   ├── molecules/              # Atoms composed together
│   │   ├── CartItem.tsx
│   │   ├── OrderRow.tsx
│   │   ├── PriceDisplay.tsx
│   │   ├── ProductCard.tsx
│   │   └── SearchBar.tsx
│   │
│   ├── organisms/              # Complex UI sections
│   │   ├── BuyBox.tsx
│   │   ├── CartSummary.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroBanner.tsx
│   │   ├── Navbar.tsx
│   │   ├── OrderList.tsx
│   │   ├── ProductGallery.tsx
│   │   └── ProductGrid.tsx
│   │
│   └── templates/              # Full page layouts (no logic)
│       ├── AccountTemplate.tsx
│       ├── CartTemplate.tsx
│       ├── HomeTemplate.tsx
│       ├── LoginTemplate.tsx
│       ├── OrdersTemplate.tsx
│       └── ProductTemplate.tsx
│
├── lib/
│   ├── data.ts                 # Mock data (replace with API calls)
│   └── types.ts                # TypeScript interfaces
│
├── store/
│   ├── authStore.ts            # Zustand auth state
│   └── cartStore.ts            # Zustand cart state
│
└── app/globals.css             # Full design system (tokens + components)
```

## Atomic Design Pattern

- **Atoms** — indivisible UI primitives: Button, Input, Badge, StarRating, Logo
- **Molecules** — atoms working together: ProductCard, CartItem, SearchBar
- **Organisms** — complex sections: Navbar, ProductGallery, BuyBox, OrderList
- **Templates** — page layouts receiving data via props (no business logic)
- **Pages** — Next.js pages that own all business logic and pass data down

## Data Flow

```
Page (logic + state)
  └── Template (layout + composition)
        └── Organism (complex UI section)
              └── Molecule (composed atoms)
                    └── Atom (primitive)
```

Pages call stores and handlers → pass data as props to templates → templates compose organisms → organisms use molecules/atoms.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Replacing Mock Data

Replace `lib/data.ts` with API calls:

```ts
// lib/data.ts (production)
export async function getProducts(): Promise<Product[]> {
  const res = await fetch('/api/products')
  return res.json()
}
```

Then in page.tsx use `async/await` (Server Components) or `useEffect` (Client Components).
