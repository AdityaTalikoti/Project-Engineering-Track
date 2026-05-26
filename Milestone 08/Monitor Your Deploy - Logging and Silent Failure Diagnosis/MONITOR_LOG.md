# Monitor & Debug Log
**Engineer:** Aditya Talikoti
**Date:** 2026-05-26

## 1. Initial State Observations
Hitting the production endpoint `GET /api/products` returned a status code `200 OK` with an empty array `[]`. There were no seeded products showing up. Furthermore, the Render Dashboard service logs were completely empty, meaning the application was failing silently with zero visibility.

## 2. Telemetry Added
To gain visibility, we made the following additions:
- Installed `morgan` logging middleware.
- Registered Morgan in `src/server.js`:
  ```javascript
  import morgan from 'morgan';
  const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
  app.use(morgan(morganFormat));
  ```
- Added explicit error loggers in all catch blocks:
  ```javascript
  catch (err) {
    console.error('Error:', err.message);
  }
  ```

## 3. Root Cause Analysis
- **File Name**: `src/controllers/productController.js`
- **Line Number**: 6 (original)
- **Root Cause**: The query was hardcoded as `Product.find({ category: req.query.category })`. When a user requests the general products list (`GET /api/products` without a category query parameter), `req.query.category` is `undefined`. This forces Mongoose to query `Product.find({ category: undefined })`. Because all seeded products have a required category ('electronics', 'clothing', 'books'), zero products matched the query, resulting in an empty array `[]` returned with a `200 OK` status and zero logged errors.

## 4. The Fix
We refactored `getProducts` inside `src/controllers/productController.js` to build a dynamic filter object. If `req.query.category` exists, it filters by category; otherwise, it finds all products:
```javascript
const filter = {};
if (req.query.category) {
  filter.category = req.query.category;
}
const products = await Product.find(filter);
```

## 5. Verification
After redeploying and calling `GET /api/products`, the API returned all 10 seeded products correctly, and the Morgan request log showed the increased response size:
```
::1 - - [26/May/2026:09:05:00 +0000] "GET /api/products HTTP/1.1" 200 1284 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
```
The response size increased from `2` bytes (empty array `[]`) to `1284` bytes.
