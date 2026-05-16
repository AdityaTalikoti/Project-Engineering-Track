# DEBUG REPORT: Production Database Failures

## Bug 1: Orphaned Orders
**Symptom**: Some orders appear in the system with no associated customer record.

**Reproduction Query**:
```sql
SELECT o.id AS order_id, o.customer_id, c.name AS customer_name 
FROM orders o 
LEFT JOIN customers c ON o.customer_id = c.id 
WHERE c.name IS NULL;
```

**Reproduction Result**:
```text
 order_id | customer_id | customer_name 
----------+-------------+---------------
        3 |        9999 | 
        4 |        9999 | 
```

**Data Flow Trace**: 
The wrong value (`9999` for `customer_id`) was inserted via the `POST /orders` route in `routes/orders.js`. This route executes an `INSERT INTO orders` statement, taking the `customer_id` directly from the request body. Because the `orders` table lacked validation to ensure the customer existed, the orphan record was written directly to the database.

**Root Cause**: 
The `orders` table was missing a `FOREIGN KEY` constraint on the `customer_id` column referencing `customers(id)`.

**Fix Applied**: 
```sql
ALTER TABLE orders ADD CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customers(id);
```
*(Applied directly in `schema.sql` via table definition)*
This prevents inserting any `customer_id` into the `orders` table that does not already exist in the `customers` table.

**Validation**: 
- Re-running the Reproduction Query now returns **0 rows**, confirming no orphaned records exist.
- **Attempted Bad Insert**:
  ```sql
  INSERT INTO orders (id, customer_id, status, total) VALUES (3, 9999, 'completed', 50.00);
  ```
- **Constraint Error Result**: 
  ```text
  ERROR: insert or update on table "orders" violates foreign key constraint "orders_customer_id_fkey"
  DETAIL: Key (customer_id)=(9999) is not present in table "customers".
  ```

---

## Bug 2: Negative Inventory
**Symptom**: Certain products show negative inventory counts after order processing.

**Reproduction Query**:
```sql
SELECT id, name, sku, inventory_count 
FROM products 
WHERE inventory_count < 0;
```

**Reproduction Result**:
```text
 id | name             | sku     | inventory_count 
----+------------------+---------+-----------------
  2 | Wireless Mouse   | SKU-002 |              -3
  3 | USB-C Cable (1m) | SKU-003 |              -5
```

**Data Flow Trace**: 
The negative values were created by the `POST /order_items` endpoint in `routes/order_items.js`. When an item is added to an order, the route performs `UPDATE products SET inventory_count = inventory_count - $1`. There was no application-level logic to verify if inventory would drop below 0, allowing subtraction to push the count into negative numbers.

**Root Cause**: 
The `products` table was missing a `CHECK` constraint on the `inventory_count` column to ensure values cannot drop below 0.

**Fix Applied**: 
```sql
ALTER TABLE products ADD CONSTRAINT products_inventory_count_check CHECK (inventory_count >= 0);
```
*(Applied directly in `schema.sql` via table definition)*
This restricts the database from saving any value in `inventory_count` that is `< 0`.

**Validation**: 
- Re-running the Reproduction Query now returns **0 rows**, confirming no negative inventory records exist.
- **Attempted Bad Insert**:
  ```sql
  INSERT INTO products (id, name, sku, inventory_count, price) VALUES (2, 'Wireless Mouse', 'SKU-002', -3, 25.00);
  ```
- **Constraint Error Result**: 
  ```text
  ERROR: new row for relation "products" violates check constraint "products_inventory_count_check"
  DETAIL: Failing row contains (2, Wireless Mouse, SKU-002, -3, 25.00).
  ```

---

## Bug 3: Duplicate Payments
**Symptom**: Some completed orders show payment status as pending, or multiple payment records exist when only one was expected.

**Reproduction Query**:
```sql
SELECT order_id, amount, status 
FROM payments 
WHERE order_id IN (
    SELECT order_id 
    FROM payments 
    GROUP BY order_id 
    HAVING COUNT(*) > 1
);
```

**Reproduction Result**:
```text
 order_id | amount | status    
----------+--------+-----------
        1 | 114.99 | pending
        1 | 114.99 | completed
```

**Data Flow Trace**: 
The duplicate payments were submitted via the `POST /payments` endpoint in `routes/payments.js`. The endpoint directly executes an `INSERT INTO payments` statement using the `order_id` from the payload. Because it didn't check for existing payments, submitting the request twice for the same `order_id` simply created multiple rows.

**Root Cause**: 
The `payments` table was missing a `UNIQUE` constraint on the `order_id` column.

**Fix Applied**: 
```sql
ALTER TABLE payments ADD CONSTRAINT payments_order_id_key UNIQUE (order_id);
```
*(Applied directly in `schema.sql` via table definition)*
This ensures that only one payment record can be linked to any specific `order_id`.

**Validation**: 
- Re-running the Reproduction Query now returns **0 rows**, confirming no duplicate payments exist.
- **Attempted Bad Insert**:
  ```sql
  INSERT INTO payments (order_id, amount, status) VALUES (1, 114.99, 'completed');
  ```
- **Constraint Error Result**: 
  ```text
  ERROR: duplicate key value violates unique constraint "payments_order_id_key"
  DETAIL: Key (order_id)=(1) already exists.
  ```
