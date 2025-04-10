// Agora Client'ını oluşturma
const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
const appId = "3ca1077e10094bbaac5c2358d238f02c"; // Agora App ID'nizi buraya girin
const token = "007eJxTYCi3tD6npub3TO+fotoC2R9zV3MtTr0Xyzfr6OG/fOHC/IUKDMbJiYYG5uaphgYGliZJSYmJyabJRsamFilGxhZpBkbJgi4/0hsCGRm0d/iwMjJAIIjPxhBQFFySWMTAAAD2eB32"; // Token'ı buraya girin
const channelName = "PrStar"; // Kanal adı

// Agora Client'ını başlatma
client.init(appId, () => {
    console.log("AgoraRTC client initialized");

    // Odaya katılma
    client.join(token, channelName, null, (uid) => {
        console.log("User " + uid + " joined channel: " + channelName);

        // Kullanıcı sesi başlatma
        const localStream = AgoraRTC.createStream({
            streamID: uid,
            audio: true,
            video: false,
            screen: false
        });

        // Yerel akışı başlatma
        localStream.init(() => {
            console.log("Local stream initialized");
            localStream.play("local_stream"); // Yerel akışın gösterileceği alan
            client.publish(localStream, (err) => {
                if (err) {
                    console.error("Publish local stream error: " + err);
                }
            });
        });
    });
}, (err) => {
    console.error("AgoraRTC client init failed", err);
});

// Diğer kullanıcıları dinleyin
client.on("stream-added", (evt) => {
    const stream = evt.stream;
    const streamId = stream.getId();
    client.subscribe(stream, (err) => {
        console.error("Subscribe stream failed: " + err);
    });
});

// Diğer kullanıcıların akışını yayınla
client.on("stream-subscribed", (evt) => {
    const remoteStream = evt.stream;
    remoteStream.play("remote_stream_" + remoteStream.getId()); // Uzak akışların gösterileceği alan
});

// Kullanıcı odadan çıktığında
client.on("peer-leave", (evt) => {
    console.log("Peer has left the channel: " + evt.uid);
});
