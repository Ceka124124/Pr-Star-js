const socket = io('https://prstar-voice-server.onrender.com');  // Render URL'ini buraya ekleyin

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

// Mesaj gönder
sendBtn.addEventListener('click', () => {
    const message = messageInput.value;
    if (message) {
        socket.emit('message', message);
        messageInput.value = '';  // Mesaj kutusunu temizle
    }
});

// Ses kaydını başlat
async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    
    mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
    };
    
    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        socket.emit('audio', audioBlob);  // Ses verisini sunucuya gönder
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
socket.on('message', (message) => {
    const li = document.createElement('li');
    li.textContent = message;
    messageList.appendChild(li);
});

// Ses kaydını almak ve oynatmak
socket.on('audio', (audioBlob) => {
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();
});
