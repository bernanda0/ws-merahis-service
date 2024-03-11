const express = require("express");
const expressWs = require("express-ws");
const WebSocket = require("ws");

const pino = require("pino");

const logger = pino(); // Initialize pino logger

const app = express();
const { getWss } = expressWs(app);

// Define WebSocket endpoint
app.ws("/chats", (ws, req) => {
  const clientIp = req.socket.remoteAddress;
  logger.info(`WebSocket connection established from IP: ${clientIp}`);

  // Handle incoming messages
  ws.on("message", (message) => {
    logger.info(`Received message from ${clientIp}: ${message}`);

    // Broadcast the message to all clients
    const channel = getWss("/chats");
    channel.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // Handle closing of WebSocket connection
  ws.on("close", () => {
    logger.info(`WebSocket connection closed for IP: ${clientIp}`);
  });
});

// Start the server
const PORT = 8080;
app.listen(PORT, () => {
  logger.info(`WS Server is listening on port ${PORT}`);
});
