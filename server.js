const express = require("express");
const { KickChannel } = require("kick_live_ws");

const app = express();
const port = process.env.PORT || 3000;

let messageCount = 0;
let channelInstance = null;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Kick Chat Counter API");
});

app.post("/start", async (req, res) => {
  const channelName = req.query.channel;

  if (!channelName) {
    return res.status(400).json({ error: "Nom de chaîne requis via ?channel=xxx" });
  }

  // Si un ancien channel était déjà actif, on le ferme
  if (channelInstance) {
    await channelInstance.disconnect();
    messageCount = 0;
  }

  try {
    channelInstance = new KickChannel(channelName);

    channelInstance.on("message", () => {
      messageCount++;
    });

    await channelInstance.connect();
    console.log(`Connecté au chat de ${channelName}`);

    res.json({ success: true, channel: channelName });
  } catch (err) {
    console.error("Erreur de connexion au chat :", err);
    res.status(500).json({ error: "Erreur lors de la connexion au chat Kick." });
  }
});

app.get("/messages", (req, res) => {
  res.json({ count: messageCount });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
