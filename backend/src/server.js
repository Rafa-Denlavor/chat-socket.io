const dotenv = require("dotenv");
const { WebSocketServer } = require("ws");

dotenv.config();

const wss = new WebSocketServer({ port: process.env.PORT || 8080 });

// Connection
wss.on("connection", () => {  
  wss.on("error", (error) => {
    console.log("[ERRO]: ", error);
  });

  // Receive the message
  wss.on("message", (data) => {
    // Goes through each client
    wss.clients.forEach((client) => {
      // Send for client
      client.send(data);
    });
  });

  console.log("[WebSocket] { Connection established }");
});
