# Security Audit Findings: Passwords in Plain Sight

## What I Found

During the security audit of the `CredApp` authentication system, we registered a test user account (`test@example.com`) and observed the following record in the MongoDB database:

```json
{
  "_id": "6a10a5c8d9079e2e41e9cb1f",
  "email": "test@example.com",
  "password": "mypassword123",
  "createdAt": "2026-05-22T18:51:52.473Z",
  "updatedAt": "2026-05-22T18:51:52.473Z",
  "__v": 0
}
```

The password field value is stored as `"mypassword123"`. 

- **Unsafe Category**: **Plain text** (no hashing, no encoding, no encryption).

---

## Root Cause

The root cause of this vulnerability lies in the signup controller ([authController.js](file:///c:/Project-Engineering-main/Milestone%2006/Passwords%20in%20Plain%20Sight/backend/controllers/authController.js)) and the user model ([User.js](file:///c:/Project-Engineering-main/Milestone%2006/Passwords%20in%20Plain%20Sight/backend/models/User.js)):

1. **Signup Controller**:
   - In `backend/controllers/authController.js` on lines 16-19:
     ```javascript
     const user = await User.create({
       email,
       password, // Stored directly as a plain-text string
     })
     ```
   - No hashing function (such as `bcrypt.hash()`) is called before saving the record.

2. **Login Controller**:
   - In `backend/controllers/authController.js` on line 43:
     ```javascript
     if (user.password !== password) {
       return res.status(401).json({ message: 'Invalid credentials' })
     }
     ```
   - The system compares the raw string from `req.body.password` directly with the plain text password stored in the database.

---

## Why This Is Dangerous

Storing passwords in plain text is a critical security vulnerability. 

1. **Database Compromise (Data Leak)**: If an attacker obtains read access to the database (through SQL/NoSQL injection, backups exposure, compromised credentials, or server access), they immediately acquire all users' passwords in clear text.
2. **Credential Stuffing**: Users often reuse passwords across different services. An attacker who retrieves plain-text passwords from `CredApp` can compromise the users' accounts on other websites (e.g., email, banking, social media).
3. **Internal Abuse (Insider Threat)**: Database administrators or internal personnel with database access can view, copy, and misuse user passwords without detection.

---

## Technical Audit Checkpoints

### Checkpoint 1 — Signup
- **Transformations**: The password is not transformed or encoded in any way.
- **Reversibility**: Yes, it's already stored in plain text.
- **Bcrypt Hashing**: `bcrypt.hash()` is not used.

### Checkpoint 2 — Database Record
- **Observed value**: `"mypassword123"`
- **Category**: Plain text.

### Checkpoint 3 — Login Comparison
- **Comparison Operator**: Uses inequality operator (`!==`) to perform direct string comparison.
- **Bcrypt Comparison**: `bcrypt.compare()` is not used.
- **Pre-comparison transformation**: None.

### Checkpoint 4 — User Model
- **Pre-save hook**: Missing.
- **Select exclusion (`select: false`)**: Missing on the `password` field (which means database queries return the password in search results by default unless explicitly excluded).
- **Password validation rules**: Missing (no minimum length or complexity checks).

## What I Fixed

We successfully applied two key security remediations in the authentication flow:

### 1. Hash the Password Before Storing (Signup)
We integrated `bcryptjs` to encrypt passwords on user registration. We updated `backend/controllers/authController.js` to hash incoming passwords with a salt factor of 10 prior to database save.

**Before:**
```javascript
// Password stored directly — no hashing
const user = await User.create({
  email,
  password, // plain text stored here
})
```

**After:**
```javascript
// Hash the password before saving
const saltRounds = 10
const hashedPassword = await bcrypt.hash(password, saltRounds)

const user = await User.create({
  email,
  password: hashedPassword,
})
```

---

### 2. Compare Safely During Login
We replaced the plain-text string inequality comparison in the login controller with a safe asynchronous comparison using `bcrypt.compare()`.

**Before:**
```javascript
// Direct string comparison — unsafe
if (user.password !== password) {
  return res.status(401).json({ message: 'Invalid credentials' })
}
```

**After:**
```javascript
// Compare safely during login
const isMatch = await bcrypt.compare(password, user.password)
if (!isMatch) {
  return res.status(401).json({ message: 'Invalid credentials' })
}
```
