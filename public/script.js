const socket = new WebSocket('ws://localhost:3000');  // WebSocket bağlantısı

let mediaRecorder;
let audioChunks = [];

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const messageList = document.getElementById('messageList');

// Ses kaydetmeye başla
startBtn.addEventListener('click', () => {
    startRecording();
});

// Ses kaydını durdur
stopBtn.addEventListener('click', () => {
    stopRecording();
});

// WebSocket bağlantısı açıldığında
socket.onopen = () => {
    console.log('WebSocket bağlantısı kuruldu.');
};

// Ses kaydını başlat
async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    
    mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
    };
    
    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        socket.send(audioBlob);  // Ses verisini sunucuya gönder
        audioChunks = [];
    };
    
    mediaRecorder.start();
    
    startBtn.disabled = true;
    stopBtn.disabled = false;
}

// Ses kaydını durdur
function stopRecording() {
    mediaRecorder.stop();
    
    startBtn.disabled = false;
    stopBtn.disabled = true;
}

// Mesajları almak ve ekrana yazdırmak
socket.onmessage = (event) => {
    const audioBlob = event.data;
    const audioUrl = URL.createObjectURL(audioBlob);  // Ses verisini URL'ye dönüştür
    const audio = new Audio(audioUrl);  // Yeni bir Audio objesi oluştur
    audio.play();  // Ses verisini çal
};

// Sohbet mesajı gönder
sendBtn.addEventListener('click', () => {
    const message = messageInput.value;
    if (message) {
        socket.send(message);  // Sohbet mesajını sunucuya gönder
        messageInput.value = '';  // Mesaj kutusunu temizle
    }
});
