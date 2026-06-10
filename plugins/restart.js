const { Module } = require("../main");

Module(
  {
    pattern: "restart",
    fromMe: true,
    desc: "Restarts the bot",
    use: "system",
  },
  async (m) => {
    await m.sendReply("_Restarting bot..._");
    process.exit(0);
  }
);
