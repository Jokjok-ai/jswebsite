
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

document.addEventListener('DOMContentLoaded', async function() {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    let encoder;
    let normalizedKnowledgeEmbeddings;
    let knowledgeSentences = [];
    let knowledgeResponses = {};
    let knowledgeDefault = "Maaf, saya belum paham. Coba tanya tentang:\n- Profil Joko\n- Proyek portofolio\n- Cara menghubungi Joko\n- Tentang AI ini";

    // Firebase Configuration
    const firebaseConfig = {
        apiKey: "AIzaSyDPnUlsY-QZIfPXbkrXiqOcXzrGWV7qJ14",
        authDomain: "portofolio-js.firebaseapp.com",
        projectId: "portofolio-js",
        storageBucket: "portofolio-js.appspot.com",
        messagingSenderId: "239757466800",
        appId: "1:239757466800:web:c4e14b5eecec815862af75",
        measurementId: "G-SX6VKD8C3N"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    function addMessage(sender, message, messageId = null) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('flex', 'items-start', 'mb-2');
        if (messageId) messageElement.id = messageId;
        
        const avatarElement = document.createElement('img');
        avatarElement.classList.add('w-8', 'h-8', 'rounded-full', 'mr-3', 'flex-shrink-0');
        avatarElement.src = sender === 'bot' ? 'images/logo-sais-blue.png' : 'images/person.png';
        avatarElement.alt = sender === 'bot' ? 'SAIS Bot Logo' : 'User Avatar';
        avatarElement.classList.add('border', sender === 'bot' ? 'border-pink-500' : 'border-blue-500');

        const textContentElement = document.createElement('div');
        textContentElement.classList.add('p-2', 'rounded-lg', 'max-w-[75%]');
        textContentElement.textContent = message;
        
        if (sender === 'bot') {
            textContentElement.classList.add('bg-purple-700', 'text-white');
            messageElement.appendChild(avatarElement);
            messageElement.appendChild(textContentElement);
        } else {
            textContentElement.classList.add('bg-blue-600', 'text-white', 'ml-auto');
            messageElement.classList.add('justify-end');
            avatarElement.classList.remove('mr-3');
            avatarElement.classList.add('ml-3');
            messageElement.appendChild(textContentElement);
            messageElement.appendChild(avatarElement);
        }
        
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    async function loadChatbotResources() {
        addMessage('bot', 'Memuat model AI dan data pengetahuan... Mohon tunggu.');
        
        try {
            // Load TensorFlow.js model
            encoder = await use.load();
            
            // Load knowledge from Firestore
            const docRef = doc(db, 'chatbot-ai', 'sais-knowledge');
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                knowledgeResponses = data.responses || {};
                knowledgeSentences = Object.keys(knowledgeResponses);
                knowledgeDefault = data.default || knowledgeDefault;
                
                // Precompute and normalize embeddings
                if (knowledgeSentences.length > 0) {
                    const embeddings = await encoder.embed(knowledgeSentences);
                    normalizedKnowledgeEmbeddings = tf.div(embeddings, tf.norm(embeddings, 2, 1, true));
                    embeddings.dispose();
                }

                addMessage('bot', data.initial_greeting || "Halo! Ada yang bisa saya bantu?");
            } else {
                addMessage('bot', 'Dokumen tidak ditemukan di Firestore');
            }
        } catch (error) {
            console.error("Error loading resources:", error);
            addMessage('bot', 'Gagal memuat sumber daya. Cek konsol untuk detail.');
        }
    }

    async function getBotResponse(userMessage) {
        if (!encoder || !normalizedKnowledgeEmbeddings) {
            return "Model AI belum siap. Mohon tunggu...";
        }

        try {
            // Embed and normalize user message
            const userEmbedding = await encoder.embed([userMessage.toLowerCase()]);
            const normalizedUserEmbedding = tf.div(userEmbedding, tf.norm(userEmbedding));

            // Efficient matrix multiplication for cosine similarity
            const similarities = tf.matMul(
                normalizedUserEmbedding, 
                normalizedKnowledgeEmbeddings, 
                false, true
            ).dataSync();

            // Find best match
            let bestMatchIndex = 0;
            let maxSimilarity = -1;
            
            for (let i = 0; i < similarities.length; i++) {
                if (similarities[i] > maxSimilarity) {
                    maxSimilarity = similarities[i];
                    bestMatchIndex = i;
                }
            }

            // Clean up tensors
            userEmbedding.dispose();
            normalizedUserEmbedding.dispose();

            // Dynamic threshold based on dataset size
            const threshold = Math.max(0.7, 0.85 - (knowledgeSentences.length * 0.00005));
            
            return maxSimilarity >= threshold
                ? knowledgeResponses[knowledgeSentences[bestMatchIndex]]
                : knowledgeDefault;
                
        } catch (error) {
            console.error("Response error:", error);
            return "Terjadi kesalahan saat memproses permintaan Anda";
        }
    }

    async function handleUserInput() {
        const message = userInput.value.trim();
        if (!message) return;

        addMessage('user', message);
        userInput.value = '';
        userInput.disabled = true;
        sendButton.disabled = true;

        // Show thinking indicator
        const thinkingId = 'thinking-message';
        addMessage('bot', 'SAIS sedang berpikir...', thinkingId);

        try {
            const response = await getBotResponse(message);
            document.getElementById(thinkingId)?.remove();
            addMessage('bot', response);
        } catch (error) {
            console.error("Error handling input:", error);
            document.getElementById(thinkingId)?.remove();
            addMessage('bot', 'Terjadi kesalahan, silakan coba lagi');
        }

        userInput.disabled = false;
        sendButton.disabled = false;
        userInput.focus();
    }

    // Event Listeners
    sendButton.addEventListener('click', handleUserInput);
    userInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') handleUserInput();
    });

    // Initial load
    loadChatbotResources();
});