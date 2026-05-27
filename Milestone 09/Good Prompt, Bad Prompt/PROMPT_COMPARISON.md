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
```
Mitosis is when cells divide. There are 4 phases. Prophase is when chromosomes condense. Metaphase the chromosomes line up. Anaphase they split. Telophase new cells form. DNA replicates before division starts. This is important for growth and repair.
```

### Bad Prompt Output
This note provides a clear and concise explanation of the process of mitosis, outlining the key phases and their functions. The information is easy to understand and the importance of DNA replication before division is highlighted effectively. However, it could be improved by elaborating on why mitosis is important for growth and repair, providing more context or examples to enhance the reader's understanding. Overall, it is a well-written and informative note.

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
```
I interviewed at Google for a SWE intern role in March. The interview had 3 rounds. First was a screening call, then two technical rounds. They asked me about arrays and dynamic programming. I solved the first problem easily but struggled with the DP one. I was given an offer but turned it down due to relocation. The interviewers were nice and gave good feedback about my problem-solving approach.
```

### Bad Prompt Output
The candidate interviewed at Google for a SWE intern role in March, going through 3 rounds - a screening call and two technical rounds. They were asked about arrays and dynamic programming, finding the first problem easy but struggling with the DP one. Despite receiving an offer, the candidate turned it down due to relocation. The interviewers were friendly and provided helpful feedback on their problem-solving approach.

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

### Improvement

