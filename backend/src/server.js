const dotenv = require("dotenv");
const { WebSocketServer } = require("ws");

dotenv.config();

const wss = new WebSocketServer({ port: process.env.PORT || 8080 });
console.log('Connecting...')

// Connection
wss.on("connection", (ws) => {
  console.log("[WebSocket] { Connection established }");

  ws.on("error", () => "[WebSocket] Error");

  // Receive the message
  ws.on("message", (data) => {
    // Goes through each client
    return wss.clients.forEach((client) => {
      // Send for client
      return client.send(data.toString());
    });
  });
});
