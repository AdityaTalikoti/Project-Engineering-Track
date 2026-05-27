# LearnLens — Prompt Quality Comparison

---

## Task A — Notes Reviewer

### Missing Components in Original
- **Missing: System Instruction** — No AI identity/persona (e.g. NoteReviewer) defined, causing generic assistant behavior.
- **Missing: Format** — No JSON shape specified, leading to inconsistent structures (prose, bullet points, letter grades) that break the UI.
- **Missing: Constraints** — No restriction on markdown, editorial language, or hallucinated facts.
- **Present: Context (barely)** — The note content is injected directly without delimiters, which could blend content with instructions.
- **Present: Task (partially)** — "give feedback" is vague and does not request specific scoring for clarity, completeness, or accuracy.

### Original Prompt
```javascript
const prompt = `give feedback on this note: ${content}`
```

### Rewritten Prompt

### Test Input Used

### Bad Prompt Output

### Good Prompt Output

### Improvement

---

## Task B — Placement Summariser

### Missing Components in Original
- **Missing: System Instruction** — No AI identity (e.g., career advisor/placement assistant) or GDPR privacy constraints defined.
- **Missing: Format** — No JSON structure or shape defined, leading to variations in summaries, outcome structures, and difficulty format (word vs number).
- **Missing: Constraints** — No restriction on including personal names (GDPR risk), restricting difficulty to a 1-5 scale, or preventing speculation.
- **Present: Context (barely)** — Text is injected directly without delimiters.
- **Present: Task (partially)** — "summarize this interview experience" is generic and does not explicitly request fields like company, role, difficulty, key topics, or outcome.

### Original Prompt
```javascript
const prompt = `summarize this interview experience: ${text}`
```

### Rewritten Prompt

### Test Input Used

### Bad Prompt Output

### Good Prompt Output

### Improvement

---

## Task C — Error Analyst

### Missing Components in Original
- **Missing: System Instruction** — No professional role (e.g., senior backend debugging engineer) defined.
- **Missing: Format** — No JSON structure specified, resulting in generic varying-length prose instead of structured data.
- **Missing: Constraints** — No restrictions on severity enum values (low/medium/high/critical), no rule to prevent speculation about causes not in the stack trace, and no rule against markdown fencing.
- **Present: Context (barely)** — Error message is injected directly without delimiters.
- **Present: Task (partially)** — "why is there a bug" is conversational and does not direct the AI to provide root cause, affected component, severity, or recommended fixes.

### Original Prompt
```javascript
const prompt = `why is there a bug: ${error_message}`
```

### Rewritten Prompt

### Test Input Used

### Bad Prompt Output

### Good Prompt Output

### Improvement

