const io = require("socket.io-client");

const socket = io("ws://185.209.75.192:5000"); // Server IP with port

socket.on("connect", () => {
    console.log("✅ Connected to server:", socket.id);


    socket.emit("subscribe", "AAPL"); // Subscribe to AAPL stock symbol

});

socket.on("stockUpdate", (data) => {
    console.log("📩 Stock Update:", data);
});

socket.on("disconnect", () => {
    console.log("❌ Disconnected from server");
});