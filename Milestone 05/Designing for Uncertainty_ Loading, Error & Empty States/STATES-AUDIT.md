# STATES-AUDIT — ShopDash Loading, Error & Empty States

## Move 1 — Gap Identification

### Orders Page (`/orders`)
| Question | Observation |
|---|---|
| What does the user see while data is loading? | A completely blank white area below the "Recent Orders" heading. No spinner, no skeleton, no indication that data is incoming. |
| What does the user see if the API call fails? | Nothing. The page stays blank with the header visible but no content, and no error message is shown. The `error` state from `useOrders` is completely ignored in the JSX. |
| What does the user see if data is empty? | Nothing. If `orders` is an empty array, `orders.map(...)` renders zero cards silently, leaving a blank grid below the heading. |

### Products Page (`/products`)
| Question | Observation |
|---|---|
| What does the user see while data is loading? | A blank content area. The "Product Inventory" heading and the Filter/Add Product buttons render immediately, but the product grid is empty with no feedback. |
| What does the user see if the API call fails? | The grid div renders with zero children and no error message. The `error` value from `useProducts` is destructured but never read in the JSX. |
| What does the user see if data is empty? | A blank, invisible grid. There is no message, illustration, or CTA when `products` is an empty array. |

### Customers Page (`/customers`)
| Question | Observation |
|---|---|
| What does the user see while data is loading? | A table with a header row (Customer, Order History, Total Value, Details) and a completely empty `<tbody>`. It looks like the system has no customers at all. |
| What does the user see if the API call fails? | Same as loading — an empty table with visible headers. The auth error thrown by `fetchCustomersError` is caught by the hook but never surfaced to the user. |
| What does the user see if data is empty? | An identical empty table. There is no way for the user to distinguish between "still loading", "failed", and "genuinely no customers exist". |

### Dashboard Page (`/`)
| Question | Observation |
|---|---|
| What does the user see while data is loading? | The heading "Overview Dashboard" renders immediately, but the four stat cards are absent (they're conditional on `stats &&`). The chart placeholder area renders, creating a misleading half-loaded page. |
| What does the user see if the API call fails? | Same as loading — the stat card grid is empty. The `error` value is never checked, leaving the user unsure whether data is loading or broken. |
| What does the user see if data is empty? | Not applicable in the same sense — the dashboard API returns a single stats object, not an array. But if the fetch fails, there is no graceful fallback. |

---

## Move 2 — Missing States Table

| Screen | Loading State | Error State | Empty State |
|---|---|---|---|
| Orders (`/orders`) | ❌ Missing | ❌ Missing | ❌ Missing |
| Products (`/products`) | ❌ Missing | ❌ Missing | ❌ Missing |
| Customers (`/customers`) | ❌ Missing | ❌ Missing | ❌ Missing |
| Dashboard (`/`) | ❌ Missing | ❌ Missing | N/A (single object) |

All three states are missing across every screen. This is the full implementation checklist.

---

## Move 3 — Loading State Design Decision

**Decision: Skeleton cards for list screens; spinner for the Dashboard.**

**Reasoning:**
- The Orders, Products, and Customers pages all render a **list of repeated cards or rows**. A skeleton screen that mirrors the shape of the real card is far superior to a spinner because it communicates the structure of the page while data loads, reducing perceived wait time and preventing layout shift.
- The Dashboard displays a single **stats object** rendered into 4 stat cards. A skeleton grid of 4 stat card shapes is used here to give the same structural preview.

### Orders skeleton plan
Each skeleton card must mirror `OrderCard.jsx`:
- Outer: `bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center`
- Left column: Two stacked placeholder bars (`h-4 bg-gray-200 rounded w-24 mb-2` and `h-3 bg-gray-200 rounded w-32`)
- Right column: Two stacked placeholder bars (`h-5 bg-gray-200 rounded w-16 mb-2` and `h-4 bg-gray-200 rounded w-14`)
- Shimmer animation: Tailwind `animate-pulse` applied to each grey placeholder div.

---

## Move 4 — Error State Copy

| Screen | Error Message | CTA |
|---|---|---|
| Orders | "We couldn't load your orders. This may be a temporary server issue — check your connection and try again." | Retry button |
| Products | "We couldn't load your product inventory. The inventory database may be unavailable right now. Please try again." | Retry button |
| Customers | "We couldn't load your customer list. The authentication server rejected the request. Try refreshing or retry." | Retry button |
| Dashboard | "We couldn't load your dashboard stats. Check your connection and try again." | Retry button |

---

## Move 5 — Empty State Copy

| Screen | Title | Supporting Message | CTA |
|---|---|---|---|
| Orders | "No orders yet" | "Once customers start placing orders, they'll appear here. New orders show up automatically." | None |
| Products | "Your inventory is empty" | "Add your first product to get started. Products you create will appear here for easy management." | "Add Product" button |
| Customers | "No customers found" | "You have no registered customers yet. Once people sign up or place orders, they'll appear here." | None |
| Dashboard | Falls back to error state — no empty state needed | — | — |

---

## Move 6 — Sketch Description

Sketches for the three Orders screen states are described below (see screenshots folder for rendered browser screenshots):

**Loading Skeleton:** Three grey placeholder cards stacked in the same `grid grid-cols-1 gap-4` layout as real OrderCards. Each card shows two rows of grey rounded bars — one wide (order ID) and one narrow (customer name) on the left; one medium bar (total) and one short rounded bar (status badge) on the right. All bars use `animate-pulse` shimmer.

**Error State:** Centered within the content area: a red warning icon, the headline "We couldn't load your orders", the supporting message, and a blue "Retry" button below.

**Empty State:** Centered within the content area: a shopping cart icon in grey, the headline "No orders yet", and the supporting message explaining when orders will appear.
