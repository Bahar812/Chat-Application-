const io =  require("socket.io-client");
const readline = require("readline");

const socket = io("http://localhost:3000");

const rl = readline.createInterface({
    input:process.stdin,
    output:process.stdout,
    prompt: "> "
});

let username = "";


socket.on("connect", () =>{
    console.log("connected to the server");

    rl.question("Enter your username: ", (input) =>{
        username = input;
        console.log(`Welcome, ${username} to the chatt`);
        rl.prompt();

        rl.on("line", (message) =>{
            if(message.trim()){
                socket.emit("message", {username, message})
            }
            rl.prompt();
        })
    });
});

socket.on("message", (data) =>{
    const {username: senderUsername, message: senderMessage} = data;
    if(senderUsername != username){
        console.log(`${senderUsername}: ${senderMessage}`);
        rl.prompt();
    }
})

socket.on("disconnect", () =>{
    console.log("Server disconnected, Exciting...")
    rl.close();
    process.exit(0);
});

// socket.on("message", (data) =>{
//     let {username, message} = data;
//     console.log(`Receiving message from ${username}: ${message}`)

// })

rl.on("SIGINT", ()=>{
    console.log("\nExciting...");
    socket.disconnect();
    rl.close();
    process.exit(0);
})

