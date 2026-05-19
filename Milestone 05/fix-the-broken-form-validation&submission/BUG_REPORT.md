# Bug Report – TrackFlow QA Form Validation & Submission

This report documents the six bugs identified in the TrackFlow bug reporter form, describing the observed behaviors and their precise technical root causes.

---

### Bug #1: Empty Submission
* **Observed Behavior:** Submitting the form with all fields completely blank succeeds immediately. A green success banner is shown stating `✓ Bug BUG-XXXX filed successfully!`, even though fields marked with `*` are empty.
* **Root Cause:** 
  1. The helper function `validate()` inside `src/App.jsx` contains no logic and unconditionally returns `true`.
  2. Inside `handleSubmit`, the call to `validate()` is made on its own (line 59), and its return value is never checked, stored, or used to halt the submission. The submission flow moves straight to the API call.

---

### Bug #2: Double Submission
* **Observed Behavior:** Clicking the "Submit Bug Report" button multiple times in rapid succession triggers multiple network requests, resulting in duplicate bug reports. The submit button is not disabled, and there is no visual loading indicator during the API request.
* **Root Cause:** 
  1. The form submission logic does not call `setLoading(true)` before initiating the asynchronous API call (`submitBugReport`).
  2. In the `finally` block of the submission, `setLoading(false)` is not called to reset the state.
  3. The Submit button in the JSX is not configured with the `disabled={loading}` attribute, allowing users to interact with it continuously while a request is in-flight.

---

### Bug #3: Form Not Cleared on Success
* **Observed Behavior:** After a successful submission, the green success banner appears, but all input fields (Title, Severity, Affected Component, Description, Steps, and No. of Steps) remain populated with the submitted values instead of resetting.
* **Root Cause:**
  1. Once the API call succeeds, the `handleSubmit` function updates the success ID and submitted list but does not call any function or state-updater (such as `setForm(EMPTY_FORM)`) to clear the `form` state back to its initial blank values.

---

### Bug #4: Silent Server Error
* **Observed Behavior:** Entering a title containing the word `"login"` and clicking Submit results in the form hanging silently with no response or error feedback. No error banner is displayed, and the form fields are not cleared.
* **Root Cause:**
  1. The API simulator in `api.js` rejects titles containing `"login"` with a `409 Conflict`.
  2. In `handleSubmit`, the `catch (err)` block is completely empty. The error is intercepted but silently swallowed. 
  * **Why an empty catch is worse than no catch:** An empty catch block is worse than having no catch block at all because it actively suppresses the error, acting as a silent execution sink. If there were no catch block, the promise rejection would propagate, triggering a console error or crash that alerts developers and users that something failed. An empty catch block hides the failure completely, leaving the UI state frozen and developers with no trace or debugging output.

---

### Bug #5: No Field-Level Messages
* **Observed Behavior:** Even if validation errors are detected or returned by the server, there are no error messages rendered next to or below individual form inputs, and inputs do not show any red visual borders.
* **Root Cause:**
  1. Although the `errors` state is declared on line 35 (`const [errors, setErrors] = useState({})`), it is never populated by `validate()` or the API's catch block.
  2. The JSX in `App.jsx` contains no rendering code or conditional logic referencing `errors.title`, `errors.severity`, `errors.component`, `errors.description`, or `errors.stepsCount`.
  3. The input elements are not styled conditionally (e.g., using red borders) when validation errors are present.

---

### Bug #6: Invalid Step Count
* **Observed Behavior:** Entering `0` or negative values (such as `-5`) in the "No. of Steps" field is permitted, and the form can be successfully submitted with these invalid values.
* **Root Cause:**
  1. The `validate()` function does not verify if `stepsCount` is a valid positive integer (e.g., `>= 1`).
  2. The step count input has `type="number"` but has no validation logic in React state management to block non-positive numbers during submission.
