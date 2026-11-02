const { Module } = require("../main");

Module(
  {
    pattern: "restart",
    fromMe: true,
    desc: "Restarts the bot",
    use: "system",
  },
  async (m) => {
    await m.sendReply("_Ok BOSS!..._");
    process.exit(0);
  }
);
