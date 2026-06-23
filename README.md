# VOID. — Shopping Cart

A streetwear-inspired e-commerce storefront. Products are sourced from the [FakeStore API](https://fakestoreapi.com/).

---

## Live Demo

[View the live site →](https://void-shopping-cart.netlify.app/)

---

## Features

- **Three-page SPA** — Home, Shop, and Cart with client-side routing via React Router
- **Persistent cart** — Add items from the Shop page, manage them on the Cart page; cart count updates live in the NavBar
- **Quantity controls** — Increment, decrement, or type a quantity directly; decrementing to zero removes the item
- **Order summary** — Real-time subtotal calculated from cart state
- **Responsive grid** — Auto-filling product grid adapts from 1 to 5 columns based on viewport width
- **Loading & error states** — Shop page handles all three fetch states gracefully
- **404 page** — Custom error page with a link back to Home
- **Scrolling ticker** — Pure CSS marquee animation on the Home page

---

## Tech Stack

| Tool                  | Purpose                  |
| --------------------- | ------------------------ |
| React 19              | UI library               |
| React Router v6       | Client-side routing      |
| Vite                  | Build tool & dev server  |
| Lucide React          | Icon library             |
| CSS Modules           | Scoped component styles  |
| Vitest                | Test runner              |
| React Testing Library | Component & hook testing |

---

## Architecture

### State Management

Cart state lives in `App.jsx` via a custom `useCart` hook. It is passed to child routes through React Router's `useOutletContext`, avoiding prop drilling without reaching for a global state library.

```
App.jsx
  └── useCart() → { cart, addToCart, removeFromCart, updateQuantity, totalItems }
        ├── NavBar (receives totalItems as prop)
        └── Outlet context → ShopPage, CartPage
```

### Reducer Design

`useCart` encapsulates a `useReducer` with three action types:

| Action             | Payload            | Behaviour                                               |
| ------------------ | ------------------ | ------------------------------------------------------- |
| `ADD_TO_CART`      | Product object     | Adds new item or increments quantity if already in cart |
| `REMOVE_FROM_CART` | Item `id`          | Removes item from cart                                  |
| `UPDATE_QUANTITY`  | `{ id, quantity }` | Updates quantity; floors at 1 via `Math.max`            |

### Folder Structure

```
src/
├── components/
│   ├── NavBar/         # NavBar.jsx, NavBar.test.jsx, NavBar.module.css
│   ├── Footer/
│   ├── ProductCard/
│   └── CartItem/
├── pages/
│   ├── HomePage/
│   ├── ShopPage/       # ShopPage.jsx, ShopPage.test.jsx
│   ├── CartPage/
│   └── ErrorPage/
├── hooks/
│   ├── useCart.js      # useCart.test.jsx colocated
│   └── useFetchProducts.js
├── App.jsx             # Layout + router element + cart state
├── main.jsx            # Router config + RouterProvider
└── index.css           # CSS reset + design tokens + global styles
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/BarreraClaudia/shopping-cart.git
cd shopping-cart
npm install
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

### Tests

```bash
npm test
```

---

## Testing

Three test suites covering the most critical application logic:

| Suite    | File                | What it covers                                                                          |
| -------- | ------------------- | --------------------------------------------------------------------------------------- |
| NavBar   | `NavBar.test.jsx`   | Rendering, link hrefs, cart badge display, active link state, navigation, accessibility |
| useCart  | `useCart.test.jsx`  | Initial state, addToCart, removeFromCart, updateQuantity, totalItems derivation         |
| ShopPage | `ShopPage.test.jsx` | Loading state, error state, success state, addToCart integration                        |

Tests follow React Testing Library's guiding principle: **test behavior, not implementation**.
