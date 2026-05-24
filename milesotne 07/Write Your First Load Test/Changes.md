# Manual Baseline & Investigation Findings

This document records the baseline performance metrics of the Movie Quote API endpoints using `curl` and details the 5 hidden performance/implementation errors discovered during investigation.

---

## 1. Manual Baseline Metrics

Using `curl.exe` with response formatting, here are the baseline metrics when the server is idle:

| Endpoint | Method | Response Time (s) | Response Size (Bytes) | Observations |
| :--- | :---: | :---: | :---: | :--- |
| `/api/quotes/unpaginated` | GET | ~0.065s | 140,537 B (~140.5 KB) | Chunked transfer, large payload size. |
| `/api/quotes?page=1&limit=20` | GET | ~0.060s | 2,851 B (~2.85 KB) | Significantly smaller payload size. |
| `/api/favorites` | POST | ~0.105s | 47 B | Slower response due to server-side artificial delay. |

---

## 2. Injected Performance & Implementation Errors

During the manual investigation and inspection of the codebase, 5 distinct errors/bottlenecks were identified:

### 1. Missing CORS Headers (Global)
* **Description:** The Express server does not configure CORS middleware (`cors()` is commented out).
* **Impact:** Cross-Origin Resource Sharing is blocked. Browsers attempting to fetch quote details from a frontend host (like `http://localhost:3000`) will fail with a CORS validation error.
* **Relevant Line:** [server.js:10-11](file:///c:/Project-Engineering-main/milesotne%2007/Write%20Your%20First%20Load%20Test/server/server.js#L10-L11)

### 2. Chunked Transfer Encoding on Unpaginated Endpoint
* **Description:** The unpaginated GET endpoint manually sets `Transfer-Encoding: chunked` and streams the entire quotes array in a single response block.
* **Impact:** It skips setting a `Content-Length` header, which forces the client to download the payload dynamically. Under concurrent load, compiling and streaming the large ~140.5 KB payload degrades performance and blocks memory.
* **Relevant Line:** [server.js:25](file:///c:/Project-Engineering-main/milesotne%2007/Write%20Your%20First%20Load%20Test/server/server.js#L25)

### 3. Pagination Off-by-One Bug
* **Description:** The paginated endpoint miscalculates `totalPages` when the total number of quotes (1,000) is exactly divisible by the limit (e.g. limit=20). 
* **Impact:** Instead of returning `50` total pages, it computes `(1000 / 20) + 1 = 51` pages. Page 51 contains no data (`[]`), which causes issues for frontend pagination controllers trying to query the last page.
* **Relevant Line:** [server.js:41-43](file:///c:/Project-Engineering-main/milesotne%2007/Write%20Your%20First%20Load%20Test/server/server.js#L41-L43)

### 4. Synchronous Event-Loop Blocking in POST Endpoint
* **Description:** The `POST /api/favorites` endpoint implements an artificial 50ms delay using a synchronous `while` loop: `while (Date.now() < start + 50) {}`.
* **Impact:** Since Node.js runs on a single event-loop thread, this completely blocks execution of all other incoming requests for 50ms per POST call. Under high concurrency, this will cause extreme latency spikes across the entire API.
* **Relevant Line:** [server.js:60-63](file:///c:/Project-Engineering-main/milesotne%2007/Write%20Your%20First%20Load%20Test/server/server.js#L60-L63)

### 5. Missing Input Validation on POST Endpoint
* **Description:** The POST handler accepts request bodies and pushes `quoteId` directly to `favorites` without verifying if it is present or if it is a valid number.
* **Impact:** Sending an empty request body `{}` succeeds with status `200` but records a favorite entry with `{ quoteId: undefined }`. This can corrupt state and cause runtime crashes in frontend components reading favorite quotes.
* **Relevant Line:** [server.js:69](file:///c:/Project-Engineering-main/milesotne%2007/Write%20Your%20First%20Load%20Test/server/server.js#L69)
