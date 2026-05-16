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
