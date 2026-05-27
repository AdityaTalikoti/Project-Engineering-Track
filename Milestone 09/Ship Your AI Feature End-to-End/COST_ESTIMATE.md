# AI Feature Cost Estimate

## Feature
Name: ToneScorer - Recruiter Cold Email Tone Auditor
Problem solved: Evaluates cold emails written to recruiters, scoring confidence, clarity, and call-to-action strength while flagging desperate-sounding phrasing.

## Token Usage (from 5 real calls in development/production logs)

| Call | Prompt Tokens | Completion Tokens | Total Tokens |
|---|---|---|---|
| 1 | 234 | 95 | 329 |
| 2 | 231 | 93 | 324 |
| 3 | 232 | 101 | 333 |
| 4 | 262 | 113 | 375 |
| 5 | 229 | 121 | 350 |
| **Average** | **237.6** | **104.6** | **342.2** |

## Model Pricing
Model: `openai/gpt-4o-mini`
Input: $0.15 per 1M tokens
Output: $0.60 per 1M tokens

## Cost Per Request
(237.6 × $0.15 / 1,000,000) + (104.6 × $0.60 / 1,000,000) = $0.0000984 per request

## Monthly Projection
Assumption: 100 users × 5 calls/day × 30 days = 15,000 requests/month
Monthly cost: 15,000 × $0.0000984 = $1.48 / month

## Rate Limit Cost Check
20 requests/hr × $0.0000984/request = $0.00197 max per user per hour (well below the $0.01 max budget per user/hour).
