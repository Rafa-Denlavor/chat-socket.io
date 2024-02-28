const dotenv = require("dotenv");
const { WebSocketServer } = require("ws");

dotenv.config();

const wss = new WebSocketServer({ port: process.env.PORT });

// Connection
wss.on("connection", () => {
  console.log("[WebSocket] { Connection established }");
  
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
});
