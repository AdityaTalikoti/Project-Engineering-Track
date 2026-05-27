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
```javascript
export const TASK_A_PROMPT = (content) => ({
  // Component 1: System Instruction (define NoteReview's expertise and quality standard)
  systemMsg: `You are NoteReview, an expert academic tutor and study-notes assessor. Your quality standard requires highly structured, objective, and constructive feedback on students' study notes.`,
  
  userMsg: `// Component 2: Context (inject {content} with --- NOTE START --- / --- NOTE END --- delimiters)
Here is the student's study note to review:
--- NOTE START ---
${content}
--- NOTE END ---

// Component 3: Task (name the three dimensions explicitly)
Evaluate the provided study note across three specific dimensions:
1. Clarity (is the text clear, coherent, and easy to understand?)
2. Completeness (does it cover the essential details of the topic?)
3. Accuracy (are there any scientific, historical, or logical errors in the facts?)

Compute an overall score and identify the top priority improvement the student should make.

// Component 4: Format (show the exact JSON structure with field names AND nested shape)
Return your evaluation strictly as a valid raw JSON object matching this exact shape:
{
  "clarity": {
    "score": 8, // integer score out of 10
    "feedback": "string explaining clarity feedback"
  },
  "completeness": {
    "score": 7, // integer score out of 10
    "feedback": "string explaining completeness feedback"
  },
  "accuracy": {
    "score": 9, // integer score out of 10
    "feedback": "string explaining accuracy feedback"
  },
  "overallScore": 8, // overall integer score out of 10
  "topPriority": "string detailing the single most important improvement the student should make"
}

// Component 5: Constraints (no markdown fencing, no editorialising, no facts invented)
- Do not include any markdown fences (e.g. \`\`\`json or \`\`\`) in your response.
- Do not editorialise about the student (e.g., do not say "You did a good job" or "The student should..."). Keep feedback objective and focused on the content itself.
- Do not invent or hallucinate any facts not present in the note.
- The output must be pure, parsable JSON only.`
})
```

### Test Input Used
```
Mitosis is when cells divide. There are 4 phases. Prophase is when chromosomes condense. Metaphase the chromosomes line up. Anaphase they split. Telophase new cells form. DNA replicates before division starts. This is important for growth and repair.
```

### Bad Prompt Output
This note provides a clear and concise explanation of the process of mitosis, outlining the key phases and their functions. The information is easy to understand and the importance of DNA replication before division is highlighted effectively. However, it could be improved by elaborating on why mitosis is important for growth and repair, providing more context or examples to enhance the reader's understanding. Overall, it is a well-written and informative note.

### Good Prompt Output
```json
{
  "clarity": {
    "score": 7,
    "feedback": "The text is clear and straightforward, but some sentences could be more concise for better understanding."
  },
  "completeness": {
    "score": 6,
    "feedback": "The note covers the basic phases of mitosis adequately but lacks detailed explanations or examples to enhance comprehension."
  },
  "accuracy": {
    "score": 8,
    "feedback": "The information provided is accurate regarding the phases of mitosis and the purpose of cell division."
  },
  "overallScore": 7,
  "topPriority": "Enhance completeness by adding more detailed explanations or examples to each phase of mitosis for a deeper understanding."
}
```

### Improvement
The original prompt lacked Format, which caused the model to return unstructured conversational prose feedback; the rewritten prompt's Format produced a structured, valid JSON object containing the clarity, completeness, accuracy, overallScore, and topPriority fields.

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
```javascript
export const TASK_B_PROMPT = (text) => ({
  // Component 1: System Instruction (define the summariser's role and privacy obligations)
  systemMsg: `You are an career advisor and placement summariser. Your role is to convert technical interview reports into clean, structured highlights. You have strict privacy obligations under GDPR to protect candidate privacy.`,
  
  userMsg: `// Component 2: Context (inject {text} with clear delimiters)
Here is the candidate's interview experience report:
--- INTERVIEW REPORT START ---
${text}
--- INTERVIEW REPORT END ---

// Component 3: Task (name all five required fields)
Summarize the interview experience report into five structured fields:
1. Company (name of the company interviewed at)
2. Role (the job title/role)
3. Difficulty (the difficulty rating from 1 to 5)
4. Key Topics (an array of core technical topics/skills discussed or tested)
5. Outcome (a one-sentence summary of the interview outcome)

// Component 4: Format (show the JSON with difficulty as a number 1–5, keyTopics as array, outcome as string)
Return your summary strictly as a valid raw JSON object matching this exact shape:
{
  "company": "string",
  "role": "string",
  "difficulty": 3, // must be an integer from 1 (very easy) to 5 (very hard)
  "keyTopics": ["topic1", "topic2"], // array of strings
  "outcome": "string"
}

// Component 5: Constraints (no personal names, difficulty must be a number, no speculation, no markdown fencing)
- Do not include any candidate or interviewer names to comply with GDPR privacy constraints.
- Do not include any markdown fences (e.g. \`\`\`json or \`\`\`) in your response.
- The "difficulty" field must be a number from 1 to 5, never a word (e.g. 3, not "Medium").
- Do not speculate or assume any facts beyond what is explicitly stated in the report.
- The output must be pure, parsable JSON only.`
})
```

### Test Input Used
```
I interviewed at Google for a SWE intern role in March. The interview had 3 rounds. First was a screening call, then two technical rounds. They asked me about arrays and dynamic programming. I solved the first problem easily but struggled with the DP one. I was given an offer but turned it down due to relocation. The interviewers were nice and gave good feedback about my problem-solving approach.
```

### Bad Prompt Output
The candidate interviewed at Google for a SWE intern role in March, going through 3 rounds - a screening call and two technical rounds. They were asked about arrays and dynamic programming, finding the first problem easy but struggling with the DP one. Despite receiving an offer, the candidate turned it down due to relocation. The interviewers were friendly and provided helpful feedback on their problem-solving approach.

### Good Prompt Output
```json
{
  "company": "Google",
  "role": "SWE intern",
  "difficulty": 4,
  "keyTopics": ["arrays", "dynamic programming"],
  "outcome": "Received an offer but declined due to relocation"
}
```

### Improvement
The original prompt lacked Constraints, which caused the output to lack a structured numeric difficulty and omit key topics and outcome details; the rewritten prompt's Constraints produced a GDPR-compliant JSON output with an integer difficulty rating from 1 to 5.

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
```javascript
export const TASK_C_PROMPT = (error_message) => ({
  // Component 1: System Instruction (define the error analyst's expertise)
  systemMsg: `You are a senior backend debugging engineer and error analyst. Your expertise lies in analyzing stack traces and error logs to identify the exact root cause, determine the affected component, assess severity, and recommend accurate code fixes.`,
  
  userMsg: `// Component 2: Context (inject {error_message} with delimiters)
Here is the error log/stack trace:
--- ERROR LOG START ---
${error_message}
--- ERROR LOG END ---

// Component 3: Task (name the four required fields)
Analyze the provided error log/stack trace and diagnose the issue by completing the following fields:
1. rootCause (explanation of the underlying cause of the error)
2. affectedComponent (the specific file/module/component where the error occurred)
3. severity (severity level of the bug)
4. recommendedFix (how to resolve this error)
5. codeSnippet (an optional code snippet demonstrating the fix, or null if not applicable)

// Component 4: Format (show the JSON with severity as enum, codeSnippet as optional)
Return your analysis strictly as a valid raw JSON object matching this exact shape:
{
  "rootCause": "string",
  "affectedComponent": "string",
  "severity": "low", // must be exactly one of: 'low', 'medium', 'high', 'critical'
  "recommendedFix": "string",
  "codeSnippet": "string" // or null
}

// Component 5: Constraints (no markdown fencing, severity must be exactly one of the four enum values, do not speculate)
- Do not include any markdown fences (e.g. \`\`\`json or \`\`\`) in your response.
- The "severity" field must be exactly one of these four string values: "low", "medium", "high", "critical". Do not use any other values.
- Do not speculate about causes or details not evidenced in the stack trace. Keep the diagnosis grounded in the provided logs.
- The output must be pure, parsable JSON only.`
})
```

### Test Input Used
```
TypeError: Cannot read properties of undefined (reading 'map')
    at UserList.render (/app/components/UserList.jsx:34:22)
    at processChild (/app/node_modules/react-dom/cjs/react-dom-server.node.development.js:3990:14)
    at resolve (/app/node_modules/react-dom/cjs/react-dom-server.node.development.js:4054:5)
    at ReactDOMServerRenderer.read (/app/node_modules/react-dom/cjs/react-dom-server.node.development.js:4402:29)
```

### Bad Prompt Output
This error occurs because you are trying to access the `map` function on a variable that is undefined. In this case, it is happening in the `UserList` component at line 34. 

To fix this issue, you need to check if the variable you are trying to map over is defined before calling the map function. You can do this by adding a conditional check before mapping over the variable. 

For example, you can modify your code like this:

```jsx
render() {
    const { users } = this.props;

    if (!users) {
        return null;
    }

    return (
        <div>
            {users.map(user => (
                <div key={user.id}>{user.name}</div>
            ))}
        </div>
    );
}
```

By adding the conditional check `if (!users)`, you are ensuring that the `map` function is only called when `users` is not undefined, avoiding the TypeError.

### Good Prompt Output
```json
{
  "rootCause": "The error occurs due to attempting to access the 'map' property of an undefined value.",
  "affectedComponent": "UserList.jsx",
  "severity": "medium",
  "recommendedFix": "Ensure that the data being accessed to perform the 'map' operation is properly defined to avoid 'undefined' values.",
  "codeSnippet": "Check the data structure before performing the 'map' operation to handle potential undefined cases."
}
```

### Improvement
The original prompt lacked Format, which caused the model to output conversational text with standard markdown code fences; the rewritten prompt's Format produced a clean, structured JSON object with rootCause, affectedComponent, severity, recommendedFix, and codeSnippet fields.

