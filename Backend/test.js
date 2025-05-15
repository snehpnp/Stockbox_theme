const io = require("socket.io-client");

const socket = io("ws://185.209.75.192:5000");

// 1
socket.on("connect", () => {
    console.log("✅ Connected to server:", socket.id);

    const userId = "user1";
    socket.emit("subscribe", userId);

    const stockSymbols = "NFO|47039#NFO|47038";
    socket.emit("subscribeStocks", stockSymbols);
});

socket.on("stockUpdate", (data) => {
    console.log("📩 Stock Update:", data);
});


socket.on("disconnect", () => {
    console.log("❌ Disconnected from server");
});