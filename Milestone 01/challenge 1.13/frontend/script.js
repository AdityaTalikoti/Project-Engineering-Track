const diffInput = document.getElementById('diffInput');
const generateBtn = document.getElementById('generateBtn');
const resultArea = document.getElementById('resultArea');
const commitOutput = document.getElementById('commitOutput');
const copyBtn = document.getElementById('copyBtn');
const loading = document.getElementById('loading');
const errorDiv = document.getElementById('error');

const BACKEND_URL = 'http://localhost:3000'; // Local development URL

generateBtn.addEventListener('click', async () => {
    const diff = diffInput.value.trim();
    if (!diff) {
        showError("Please enter a diff or description.");
        return;
    }

    clearUI();
    showLoading(true);

    try {
        const response = await fetch(`${BACKEND_URL}/generate-commit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ diff })
        });

        const data = await response.json();

        if (response.ok) {
            showResult(data.commit);
        } else {
            showError(data.error || "Failed to generate commit message.");
        }
    } catch (err) {
        showError("Unable to connect to the backend. Is it running?");
    } finally {
        showLoading(false);
    }
});

copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(commitOutput.textContent);
    const originalText = copyBtn.textContent;
    copyBtn.textContent = "Copied!";
    setTimeout(() => copyBtn.textContent = originalText, 2000);
});

function showLoading(isLoading) {
    loading.classList.toggle('hidden', !isLoading);
    generateBtn.disabled = isLoading;
}

function showResult(commit) {
    resultArea.classList.remove('hidden');
    commitOutput.textContent = commit;
}

function showError(msg) {
    errorDiv.classList.remove('hidden');
    errorDiv.textContent = msg;
}

function clearUI() {
    resultArea.classList.add('hidden');
    errorDiv.classList.add('hidden');
}
