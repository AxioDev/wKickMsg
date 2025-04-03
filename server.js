// serveur.js
const express = require('express');
const { KickChannel } = require("kick_live_ws");

const app = express();
const port = 3000;

let messageCount = 0;

const channel = new KickChannel("bichouu");

channel.on("message", () => {
  messageCount++;
});

channel.connect();

app.get("/messages", (req, res) => {
  res.json({ count: messageCount });
});

app.listen(port, () => {
  console.log(`API message counter disponible sur http://localhost:${port}`);
});
