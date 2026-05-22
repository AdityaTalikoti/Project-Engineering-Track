# ShopFlat Folder Structure Analysis

## Current State
Currently, all files in the `src/` directory live at the flat root, making it chaotic to navigate. Here is the list of files under `src/`:
- `App.jsx`
- `Button.jsx`
- `CartItem.jsx`
- `CartSummary.jsx`
- `CheckoutModal.jsx`
- `Dashboard.jsx`
- `EmptyState.jsx`
- `ErrorMessage.jsx`
- `LoginForm.jsx`
- `LogoutButton.jsx`
- `Modal.jsx`
- `Navbar.jsx`
- `OrderCard.jsx`
- `OrdersList.jsx`
- `ProductCard.jsx`
- `ProductList.jsx`
- `Spinner.jsx`
- `apiClient.js`
- `cartService.js`
- `formatCurrency.js`
- `index.css`
- `loginService.js`
- `main.jsx`
- `ordersService.js`
- `productsService.js`
- `truncateText.js`
- `useCart.js`
- `useDebounce.js`
- `useLogin.js`
- `useProducts.js`

## Time-to-find estimate
Based on the current flat structure, a new engineer looking for the cart checkout logic would have to visually scan 30 files in a single directory. They would likely look for files with "cart" or "checkout" in their names, such as `useCart.js`, `cartService.js`, or `CheckoutModal.jsx`. 
It would take a new engineer approximately **5 to 10 minutes** to parse through the flat list, open relevant files, trace the dependencies, and locate where the actual checkout API invocation or state transitions happen.

## File Mapping Plan

### Shared Files
- `Button.jsx` → `src/components/Button.jsx` (Shared UI button)
- `Modal.jsx` → `src/components/Modal.jsx` (Shared UI modal container)
- `Spinner.jsx` → `src/components/Spinner.jsx` (Shared UI loading spinner)
- `EmptyState.jsx` → `src/components/EmptyState.jsx` (Shared UI empty state)
- `ErrorMessage.jsx` → `src/components/ErrorMessage.jsx` (Shared UI error alert)
- `Navbar.jsx` → `src/components/Navbar.jsx` (Shared navigation menu)
- `useDebounce.js` → `src/hooks/useDebounce.js` (Shared input debouncer hook)
- `formatCurrency.js` → `src/utils/formatCurrency.js` (Shared formatting utility)
- `truncateText.js` → `src/utils/truncateText.js` (Shared string utility)
- `apiClient.js` → `src/services/apiClient.js` (Shared axios/fetch client service)

### Feature: Auth
- `LoginForm.jsx` → `src/features/auth/LoginForm.jsx`
- `LogoutButton.jsx` → `src/features/auth/LogoutButton.jsx`
- `loginService.js` → `src/features/auth/loginService.js`
- `useLogin.js` → `src/features/auth/useLogin.js`

### Feature: Cart
- `CartItem.jsx` → `src/features/cart/CartItem.jsx`
- `CartSummary.jsx` → `src/features/cart/CartSummary.jsx`
- `CheckoutModal.jsx` → `src/features/cart/CheckoutModal.jsx`
- `cartService.js` → `src/features/cart/cartService.js`
- `useCart.js` → `src/features/cart/useCart.js`

### Feature: Products
- `ProductCard.jsx` → `src/features/products/ProductCard.jsx`
- `ProductList.jsx` → `src/features/products/ProductList.jsx`
- `productsService.js` → `src/features/products/productsService.js`
- `useProducts.js` → `src/features/products/useProducts.js`

### Feature: Orders
- `Dashboard.jsx` → `src/features/orders/Dashboard.jsx` (Orders history page layout)
- `OrderCard.jsx` → `src/features/orders/OrderCard.jsx`
- `OrdersList.jsx` → `src/features/orders/OrdersList.jsx`
- `ordersService.js` → `src/features/orders/ordersService.js`

### Root Entry Files
- `App.jsx` → remains `src/App.jsx`
- `main.jsx` → remains `src/main.jsx`
- `index.css` → remains `src/index.css`

## Target Folder Tree
```
src/
├── features/
│   ├── auth/
│   │   ├── LoginForm.jsx
│   │   ├── LogoutButton.jsx
│   │   ├── loginService.js
│   │   └── useLogin.js
│   ├── cart/
│   │   ├── CartItem.jsx
│   │   ├── CartSummary.jsx
│   │   ├── CheckoutModal.jsx
│   │   ├── cartService.js
│   │   └── useCart.js
│   ├── products/
│   │   ├── ProductCard.jsx
│   │   ├── ProductList.jsx
│   │   ├── productsService.js
│   │   └── useProducts.js
│   └── orders/
│       ├── Dashboard.jsx
│       ├── OrderCard.jsx
│       ├── OrdersList.jsx
│       └── ordersService.js
├── components/
│   ├── Button.jsx
│   ├── EmptyState.jsx
│   ├── ErrorMessage.jsx
│   ├── Modal.jsx
│   ├── Navbar.jsx
│   └── Spinner.jsx
├── hooks/
│   └── useDebounce.js
├── utils/
│   ├── formatCurrency.js
│   └── truncateText.js
├── services/
│   └── apiClient.js
├── App.jsx
├── index.css
└── main.jsx
```
