const chatbox = document.getElementById('chatbox');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
let conversationHistory = [];
let isTyping = false;

// Initialize with welcome message
window.addEventListener('load', function() {
    const welcomeMessage = "Hey there! My name is Axis! I'm an expert philosopher, what questions do you have?";
    appendToHistory(welcomeMessage, 'ai');
    displayMessage(welcomeMessage, 'ai', true);
});

// Auto-resize textarea
userInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
});

// Handle Enter key
userInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});

// Send button click handler
sendButton.addEventListener('click', sendMessage);

async function sendMessage() {
    if (isTyping) return;

    const message = userInput.value.trim();
    if (message === '') return;

    userInput.value = '';
    userInput.style.height = 'auto';

    appendToHistory(message, 'user');
    displayMessage(message, 'user');

    setInputState(false);
    showTypingIndicator();

    const formattedHistory = formatHistoryForAPI(conversationHistory, message);
    let aiResponse = "I apologize, but I'm having trouble connecting right now. Please try again.";

    try {
        const response = await fetch('https://hyrumhendrickson.com:3000/execute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Purpose': 'axis_request'
            },
            body: JSON.stringify({ question: formattedHistory })
        });

        aiResponse = await response.text();

        if (!aiResponse) {
            aiResponse = "I apologize, but I didn't receive a proper response. Could you try rephrasing your question?";
        }
    } catch (error) {
        console.error('Error:', error);
        aiResponse = "I'm experiencing some technical difficulties. Please try again in a moment.";
    }

    hideTypingIndicator();
    appendToHistory(aiResponse, 'ai');
    displayMessage(aiResponse, 'ai', true);
    setInputState(true);
}

function displayMessage(message, sender, animate = false) {
    const messageElement = createMessageElement(message, sender);
    chatbox.appendChild(messageElement);

    if (animate && sender === 'ai') {
        animateTyping(message, messageElement.querySelector('.message-content'));
    } else {
        messageElement.querySelector('.message-content').textContent = message;
    }

    chatbox.scrollTop = chatbox.scrollHeight;
}

function createMessageElement(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message`;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    messageDiv.innerHTML = `
        <div class="message-header">
            <div class="message-avatar">
                ${sender === 'user' ?
                    '<div class="user-avatar">You</div>' :
                    `<div class="ai-avatar">
                        <img src="axislogo.png" alt="Axis Logo" class="axis-logo-small">
                     </div>`
                }
            </div>
            <div class="message-info">
                <span class="message-sender">${sender === 'user' ? 'You' : 'Axis'}</span>
                <span class="message-time">${timestamp}</span>
            </div>
        </div>
        <div class="message-content"></div>
    `;

    return messageDiv;
}

function animateTyping(text, element) {
    isTyping = true;
    element.textContent = '';
    let index = 0;

    const interval = setInterval(() => {
        element.textContent += text[index];
        chatbox.scrollTop = chatbox.scrollHeight;
        index++;

        if (index === text.length) {
            clearInterval(interval);
            isTyping = false;
        }
    }, 30);
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message ai-message typing-indicator';
    typingDiv.id = 'typingIndicator';

    typingDiv.innerHTML = `
        <div class="message-header">
            <div class="message-avatar">
                <div class="ai-avatar">
                    <img src="axislogo.png" alt="Axis Logo" class="axis-logo-small">
                </div>
            </div>
            <div class="message-info">
                <span class="message-sender">Axis</span>
                <span class="typing-text">is thinking...</span>
            </div>
        </div>
        <div class="message-content">
            <div class="typing-dots">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
        </div>
    `;

    chatbox.appendChild(typingDiv);
    chatbox.scrollTop = chatbox.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function setInputState(enabled) {
    userInput.disabled = !enabled;
    sendButton.disabled = !enabled;

    if (enabled) {
        userInput.focus();
        sendButton.classList.remove('disabled');
    } else {
        sendButton.classList.add('disabled');
    }
}

function appendToHistory(message, sender) {
    conversationHistory.push({ sender: sender, message: message });
}

function formatHistoryForAPI(history, question) {
    const recentHistory = history.slice(-2);

    let formattedHistory = 'This is the history:\n';
    recentHistory.forEach(entry => {
        formattedHistory += `${entry.sender.toUpperCase()}: ${entry.message}\n`;
    });
    formattedHistory += 'This is the question:\n';
    formattedHistory += `USER: ${question}`;
    return formattedHistory;
}

document.addEventListener('DOMContentLoaded', function() {
    userInput.focus();
});
