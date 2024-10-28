const io = require("socket.io-client");
const readline = require("readline");
const crypto = require("crypto"); // Import modul crypto

const socket = io("http://localhost:3000");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "> "
});

let username = "";

// Fungsi untuk hashing pesan menggunakan SHA-256
function hashMessage(message) {
    return crypto.createHash('sha256').update(message).digest('hex');
}

socket.on("connect", () => {
    console.log("Connected to the server");

    rl.question("Enter your username: ", (input) => {
        username = input;
        console.log(`Welcome, ${username}, to the chat`);
        rl.prompt();

        rl.on("line", (message) => {
            if (message.trim()) {
                // Hashing pesan sebelum dikirim ke server
                const hashedMessage = hashMessage(message);
                socket.emit("message", { username, message: hashedMessage });
            }
            rl.prompt();
        });
    });
});

socket.on("message", (data) => {
    const { username: senderUsername, message: senderMessage } = data;
    if (senderUsername !== username) {
        console.log(`${senderUsername}: ${senderMessage}`);
        rl.prompt();
    }
});

socket.on("disconnect", () => {
    console.log("Server disconnected, exiting...");
    rl.close();
    process.exit(0);
});

rl.on("SIGINT", () => {
    console.log("\nExiting...");
    socket.disconnect();
    rl.close();
    process.exit(0);
});
