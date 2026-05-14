// Conversation history (full context)
const messages = [];

const chatDisplay = document.getElementById('chatDisplay');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

/**
 * Render a message bubble in the chat display
 */
function renderMessage(role, content) {
    const messageDiv = document.createElement('div');

    messageDiv.classList.add('message', role);

    messageDiv.textContent = content;

    chatDisplay.appendChild(messageDiv);

    // Auto-scroll to bottom
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

/**
 * Handle sending the message
 */
async function sendMessage() {
    const text = messageInput.value.trim();

    if (!text) return;

    // 1. Add user message to state
    messages.push({
        role: "user",
        content: text
    });

    // 2. Render user bubble
    renderMessage("user", text);

    // 3. Clear input
    messageInput.value = "";

    try {
        // Optional loading message
        renderMessage("assistant", "Typing...");

        // 4. Call backend /chat route
        const response = await fetch('http://localhost:3000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: messages
            })
        });

        const data = await response.json();

        // Remove "Typing..." message
        const typingMessage =
            document.querySelector('.assistant:last-child');

        if (typingMessage) {
            typingMessage.remove();
        }

        // Handle backend errors
        if (!response.ok) {
            renderMessage(
                "assistant",
                data.error || "Something went wrong"
            );
            return;
        }

        // 5. Save assistant reply to state
        messages.push({
            role: "assistant",
            content: data.reply
        });

        // 6. Render assistant bubble
        renderMessage("assistant", data.reply);

    } catch (error) {
        console.error("Frontend Error:", error);

        renderMessage(
            "assistant",
            "Failed to connect to server."
        );
    }
}

// Event Listeners
sendBtn.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});