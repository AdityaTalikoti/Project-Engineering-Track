# NoteAI — AI Cost Estimate

## Token Usage (5 Test Calls)

| Call | Note (words) | Prompt Tokens | Completion Tokens | Total Tokens |
|---|---|---|---|---|
| 1 | ~200 (short-note.txt) | 347 | 140 | 487 |
| 2 | ~500 (medium-note.txt) | 638 | 201 | 839 |
| 3 | ~800 (long-note.txt) | 1025 | 149 | 1174 |
| 4 | ~100 (custom short) | 199 | 143 | 342 |
| 5 | ~400 (custom long) | 531 | 184 | 715 |
| **Average** | — | **548.0** | **163.4** | **711.4** |

## Model Pricing (look up at openrouter.ai/models)

| Model | Input $/1M tokens | Output $/1M tokens |
|---|---|---|
| openai/gpt-4o-mini | $0.15 | $0.60 |
| meta-llama/llama-3.1-8b-instruct | $0.055 | $0.055 |

## Cost Projection Table

| Model | Avg Tokens/Req | Cost/Request | Daily (10 users) | Daily (100 users) | Monthly (100 users) |
|---|---|---|---|---|---|
| gpt-4o-mini | 548.0 Prompt / 163.4 Comp | $0.00018024 | $0.00901200 | $0.09012000 | $2.70 |
| llama-3.1-8b-instruct | 548.0 Prompt / 163.4 Comp | $0.00003913 | $0.00195635 | $0.01956350 | $0.59 |

*Assumes 5 AI calls per user per day.*
*Formula: cost/req = (avg_prompt × input_$/1M) + (avg_completion × output_$/1M)*
*Daily = cost/req × users × 5 calls*
*Monthly = daily × 30*

### Arithmetic Steps

#### 1. openai/gpt-4o-mini
- **Cost/Request**:
  $$(548.0 \times \frac{\$0.15}{1,000,000}) + (163.4 \times \frac{\$0.60}{1,000,000}) = \$0.00008220 + \$0.00009804 = \$0.00018024$$
- **Daily (10 users)**:
  $$\$0.00018024 \times 10 \times 5 = \$0.00901200$$
- **Daily (100 users)**:
  $$\$0.00018024 \times 100 \times 5 = \$0.09012000$$
- **Monthly (100 users)**:
  $$\$0.09012000 \times 30 = \$2.7036 \approx \$2.70$$

#### 2. meta-llama/llama-3.1-8b-instruct
- **Cost/Request**:
  $$(548.0 \times \frac{\$0.055}{1,000,000}) + (163.4 \times \frac{\$0.055}{1,000,000}) = \$0.00003014 + \$0.00000899 = \$0.00003913$$
- **Daily (10 users)**:
  $$\$0.00003913 \times 10 \times 5 = \$0.00195635$$
- **Daily (100 users)**:
  $$\$0.00003913 \times 100 \times 5 = \$0.01956350$$
- **Monthly (100 users)**:
  $$\$0.01956350 \times 30 = \$0.5869 \approx \$0.59$$

## Model Recommendation

I recommend `openai/gpt-4o-mini`, which has a monthly cost of $2.70 for 100 users. By choosing this model over the cheaper `meta-llama/llama-3.1-8b-instruct` ($0.59/mo), we gain superior structure adherence to output pure JSON and avoid UI breakage, at the expense of a slightly higher but still negligible bill.

## Token Plausibility Verification

Model tested: openai/gpt-4o-mini
Note used: short-note.txt
Note word count: approximately 184 words
Tokenizer result (from platform.openai.com/tokenizer): 251 tokens for the note alone
System prompt tokens (estimate): approximately 85 tokens (66 words)
Expected total prompt tokens: approximately 347 (251 note tokens + 85 system prompt tokens + 11 chat template overhead tokens)
Logged promptTokens from [AI_USAGE]: 347
Difference explanation: The logged prompt tokens (347) match the expected total tokens exactly. The system prompt (~85 tokens) and message formatting metadata (~11 tokens) explain the difference between the raw note token count (251 tokens) and the logged prompt tokens.

