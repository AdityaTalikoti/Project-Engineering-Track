# Movie Quote API Load Test Report

This report presents the findings of the Artillery load tests performed against the Movie Quote API. The tests evaluate the performance differences between paginated and unpaginated GET endpoints and measure the behavior of the POST endpoint under concurrency.

---

## 1. Load Test Configurations

The load tests were executed using Artillery targeting `http://localhost:3001` with the following parameters:

*   **Ramp-up Phase:** Simulated 50 virtual users ramping up and sustained over 30 seconds.
*   **Virtual User Scenarios:**
    *   **Get all quotes (unpaginated):** Requests `GET /api/quotes/unpaginated`
    *   **Get paginated quotes (page 1, limit 20):** Requests `GET /api/quotes?page=1&limit=20`
    *   **Add to favorites:** Requests `POST /api/favorites` with payload `{ "quoteId": 1 }`

*   **Total Requests Sent (Combined Run):** 1,500 requests.
*   **Target Status Check:** Ensured all HTTP status codes returned were `200`.

To capture precise performance characteristics of each endpoint, isolated test scenarios were also run with an arrival rate of 30 virtual users per second over 15 seconds (450 total requests per test).

---

## 2. Results Summary by Endpoint

Below are the performance characteristics recorded for each scenario:

### Combined Load Test Results (All 3 endpoints queried simultaneously)
*   **Total Completed Scenarios:** 1,500
*   **Throughput (Combined):** 50 requests per second
*   **Error Rate:** 0% (all 1,500 requests returned status code 200)
*   **Overall Median Response Time:** 153 ms
*   **Overall p95 Response Time:** 727.9 ms
*   **Overall p99 Response Time:** 1043.3 ms
*   **Total Downloaded Volume:** ~75.2 MB

### Isolated Endpoint Results
*   **GET /api/quotes/unpaginated (GET all 1,000 quotes):**
    *   Median Response Time: 2 ms
    *   p95 Response Time: 7 ms
    *   Throughput: 30 requests per second
    *   Error Rate: 0%
    *   Total Downloaded Data: 63.2 MB (Average payload size ~140.5 KB per request)

*   **GET /api/quotes?page=1&limit=20 (GET 20 paginated quotes):**
    *   Median Response Time: 1 ms
    *   p95 Response Time: 4 ms
    *   Throughput: 30 requests per second
    *   Error Rate: 0%
    *   Total Downloaded Data: 1.28 MB (Average payload size ~2.85 KB per request)

*   **POST /api/favorites (POST favorite quote with 50ms artificial blocking delay):**
    *   Median Response Time: 3,828.5 ms (3.83 seconds)
    *   p95 Response Time: 7,260.8 ms (7.26 seconds)
    *   Throughput: 30 requests per second (took 23s to complete all requests due to latency backlog)
    *   Error Rate: 0%
    *   Total Downloaded Data: 21 KB (Average payload size ~47 B)

---

## 3. Comparison: Unpaginated vs. Paginated GET Endpoints

Comparing the two GET endpoints reveals a dramatic difference in resources and efficiency:

*   **Payload Size and Bandwidth Consumption:** The unpaginated GET endpoint returns all 1,000 quotes in memory, resulting in a ~140.5 KB payload. The paginated GET endpoint returns only 20 quotes, resulting in a ~2.85 KB payload. Under 450 requests, the unpaginated endpoint consumed **63.2 MB** of bandwidth, while the paginated endpoint consumed only **1.28 MB** (a **98% reduction** in bandwidth!).
*   **Latency Difference:** While both endpoints run in memory and appear fast locally when isolated, the paginated endpoint is roughly twice as fast as the unpaginated endpoint (median 1ms vs 2ms, p95 4ms vs 7ms). Under real-world network constraints, transferring 140.5 KB takes significantly longer than 2.85 KB, causing user-facing latency to balloon on the unpaginated version.
*   **Resource Footprint:** Compiling, serializing, and transmitting 1,000 JSON records repeatedly places a heavy CPU and memory load on the Node.js process. In contrast, slicing 20 items and returning them keeps the server responsive and avoids memory spikes.

---

## 4. What is p95 Response Time and Why Does It Matter?

*   **Definition of p95:** The 95th percentile (p95) response time means that 95% of all requests completed faster than this duration, while the slowest 5% of requests took longer. For example, in our combined run, the p95 was 727.9 ms, meaning that 95% of users experienced a response time under 727.9 ms, while 5% experienced slower times (up to 1,250 ms).
*   **Why It Matters:** The median (p50) is useful to understand average behavior, but it hides outliers and "noisy neighbor" effects. The p95 response time is the industry standard for measuring user experience because it represents what the slowest 5% of your actual users are experiencing. A low median but high p95 indicates that while the system is fast for most users, it is failing or severely degraded for a subset of them.

---

## 5. Performance Observations of Injected Code Bugs

Under load, the 5 hidden errors in the starter code directly impacted our metrics:

1.  **CORS Missing:** Prevents browsers from loading quotes from a frontend, limiting the API's usability.
2.  **Chunked Transfer Encoding:** The unpaginated GET manually sets `Transfer-Encoding: chunked`. This prevents the server from sending a `Content-Length` header, which causes modern HTTP clients to keep connections open longer and stream data dynamically, increasing connection overhead.
3.  **Pagination Off-by-One:** Calculating `totalPages` as 51 instead of 50 causes clients requesting the last page to get empty arrays.
4.  **Synchronous Event-Loop Blocking:** The `while (Date.now() < start + 50) {}` loop in the POST favorites handler blocks the single thread of Node.js. Under concurrency, this causes a massive queue of requests, causing response time to escalate from 50ms to over 7.2 seconds for the POST endpoint. Furthermore, because the entire event loop is blocked, GET requests are also held up, explaining why the combined load test median rose to 153ms.
5.  **No Input Validation:** Allowing empty payload posts leads to corrupted memory arrays containing `{ quoteId: undefined }` which could crash downstream consumers.
