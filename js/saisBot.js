
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

document.addEventListener('DOMContentLoaded', async function () {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    let encoder;
    let knowledgeData = {};
    let knownSentences = [];
    let knownEmbeddings; 

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
        function addMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('flex', 'items-start', 'mb-2'); 
        
        const avatarElement = document.createElement('img');
        avatarElement.classList.add('w-8', 'h-8', 'rounded-full', 'mr-3', 'flex-shrink-0');
        // Menggunakan logika image yang lebih sesuai dengan request awal Anda (ftprofil.jpg untuk user)
        avatarElement.src = sender === 'bot' ? 'images/logo-sais-blue.png' : 'images/person.png'; 
        avatarElement.alt = sender === 'bot' ? 'SAIS Bot Logo' : 'User Avatar';
        // Mengembalikan warna border seperti yang ada di kode awal
        avatarElement.classList.add(sender === 'bot' ? 'border' : 'border', sender === 'bot' ? 'border-pink-500' : 'border-blue-500'); 

        const textContentElement = document.createElement('div');
        textContentElement.classList.add('p-2', 'rounded-lg', 'max-w-[75%]');
        textContentElement.textContent = message;
        
        if (sender === 'bot') {
            textContentElement.classList.add('bg-purple-700', 'text-white');
        } else {
            textContentElement.classList.add('bg-blue-600', 'text-white', 'ml-auto');
        }

        if (sender === 'bot') {
            messageElement.appendChild(avatarElement);
            messageElement.appendChild(textContentElement);
        } else {
            messageElement.classList.add('justify-end');
            messageElement.appendChild(textContentElement);
            // Mengubah urutan agar avatar user ada di kanan
            avatarElement.classList.remove('mr-3');
            avatarElement.classList.add('ml-3');
            messageElement.appendChild(avatarElement);
        }
        
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function cosineSimilarity(vec1, vec2) {
        const tensorVec1 = tf.tensor(vec1);
        const tensorVec2 = tf.tensor(vec2);

        const dotProduct = tf.sum(tf.mul(tensorVec1, tensorVec2));
        const norm1 = tf.norm(tensorVec1);
        const norm2 = tf.norm(tensorVec2);
        
        if (norm1.arraySync() === 0 || norm2.arraySync() === 0) {
            return 0;
        }

        return tf.div(dotProduct, tf.mul(norm1, norm2)).arraySync();
    }

    async function loadChatbotResources() {
        addMessage('bot', 'Memuat model AI dan data pengetahuan... Mohon tunggu.');
        try {
            encoder = await use.load();
            addMessage('bot', 'Model AI berhasil dimuat!');

            const docRef = doc(db, 'chatbot-ai', 'sais-knowledge');
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                knowledgeData = {
                    responses: data.responses || {},
                    initial_greeting: data.initial_greeting || '',
                    default: data.default || ''
                };
                
                knownSentences = Object.keys(knowledgeData.responses);
                if (knownSentences.length > 0) {
                    knownEmbeddings = await encoder.embed(knownSentences.map(s => s.toLowerCase()));
                    addMessage('bot', knowledgeData.initial_greeting || "Halo! Ada yang bisa saya bantu?");
                } else {
                    addMessage('bot', 'Data pengetahuan (pertanyaan/respons) tidak ditemukan di Firestore.');
                }
                
            } else {
                addMessage('bot', 'Dokumen "sais-knowledge" tidak ditemukan di Firestore. Pastikan ada di koleksi "chatbot-ai".');
            }
        } catch (error) {
            addMessage('bot', 'Gagal memuat sumber daya chatbot. Cek konsol browser untuk detail.');
            console.error("Error loading chatbot resources:", error);
        }
    }

    // Fungsi untuk mendapatkan respons bot berdasarkan pesan pengguna
    async function getBotResponse(userMessage) {
        if (!encoder) {
            return "Maaf, model AI belum siap. Mohon tunggu sebentar atau refresh halaman.";
        }
        if (!knownEmbeddings || knownSentences.length === 0) {
            return "Maaf, data pengetahuan bot belum termuat atau kosong.";
        }

        const cleanedMessage = userMessage.toLowerCase().trim();
        const userEmbedding = (await encoder.embed([cleanedMessage])).arraySync()[0];

        let bestResponse = knowledgeData.default || "Maaf, saya tidak mengerti. Bisakah Anda mengulangi atau mencoba pertanyaan lain?";
        let maxSimilarity = -1;

        const similarityThreshold = 0.7;

        for (let i = 0; i < knownSentences.length; i++) {
            const knownSentence = knownSentences[i];
            const currentKnownEmbedding = knownEmbeddings.slice([i, 0], [1, -1]).arraySync()[0];

            const similarity = cosineSimilarity(userEmbedding, currentKnownEmbedding);

            if (similarity > maxSimilarity) {
                maxSimilarity = similarity;
                if (similarity >= similarityThreshold) {
                     bestResponse = knowledgeData.responses[knownSentence];
                }
            }
        }

        if (maxSimilarity < similarityThreshold) {
            bestResponse = knowledgeData.default || "Maaf, saya belum paham. Coba tanya tentang:\n- Profil Joko\n- Proyek portofolio\n- Cara menghubungi Joko\n- Tentang AI ini";
        }

        return bestResponse;
    }

    sendButton.addEventListener('click', async () => {
        const message = userInput.value.trim();
        if (message) {
            addMessage('user', message);
            userInput.value = '';

            setTimeout(async () => {
                const botReply = await getBotResponse(message);
                addMessage('bot', botReply); // Ubah 'sais' menjadi 'bot' agar konsisten dengan addMessage
            }, 700);
        }
    });

    userInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });

    loadChatbotResources();
});