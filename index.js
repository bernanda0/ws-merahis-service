const express = require("express");
const expressWs = require("express-ws");
const WebSocket = require("ws");
const pino = require("pino");

const logger = pino();

const app = express();
const { getWss } = expressWs(app);

app.ws("/yin", (ws, req) => {
  const clientIp = req.socket.remoteAddress;
  logger.info(`WebSocket connection established for yin from IP: ${clientIp}`);

  ws.on("message", (message) => {
    logger.info(`Received message for yin from ${clientIp}: ${message}`);
    const channel = getWss("/yin");
    channel.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => {
    logger.info(`WebSocket connection closed for yin from IP: ${clientIp}`);
  });
});

app.ws("/yang", (ws, req) => {
  const clientIp = req.socket.remoteAddress;
  logger.info(`WebSocket connection established for yang from IP: ${clientIp}`);

  ws.on("message", (message) => {
    logger.info(`Received message for yang from ${clientIp}: ${message}`);
    const channel = getWss("/yang");
    channel.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => {
    logger.info(`WebSocket connection closed for yang from IP: ${clientIp}`);
  });
});

const PORT = 8080;
app.listen(PORT, () => {
  logger.info(`WS Server is listening on port ${PORT}`);
});
