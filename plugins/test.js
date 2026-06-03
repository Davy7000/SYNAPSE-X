function TimeCalculator(a) {
  let b = Math.floor(a / 31536e3),
    c = Math.floor((a % 31536e3) / 2628e3),
    d = Math.floor(((a % 31536e3) % 2628e3) / 86400),
    e = Math.floor((a % 86400) / 3600),
    f = Math.floor((a % 3600) / 60),
    g = Math.floor(a % 60);
  return (
    (b > 0 ? b + (1 === b ? " year, " : " years, ") : "") +
    (c > 0 ? c + (1 === c ? " month, " : " months, ") : "") +
    (d > 0 ? d + (1 === d ? " day, " : " days, ") : "") +
    (e > 0 ? e + (1 === e ? " hour, " : " hours, ") : "") +
    (f > 0 ? f + (1 === f ? " minute " : " minutes, ") : "") +
    (g > 0 ? g + (1 === g ? " second" : " seconds ") : "")
  );
}
const { Module } = require("../main");
Module(
  {
    pattern: "age ?(.*)",
    desc: "Age calculator .age dob",
    use: "utility",
  },
  async (m, t) => {
    if (!t[1]) return await m.sendReply("_Give me your Date of Birth_");
    if (
      !/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/.test(t[1])
    )
      return await m.sendReply("_Date must be in dd/mm/yy format_");
    var DOB = t[1];
    var actual = DOB.includes("-")
      ? DOB.split("-")[1] + "-" + DOB.split("-")[0] + "-" + DOB.split("-")[2]
      : DOB.split("/")[1] + "-" + DOB.split("/")[0] + "-" + DOB.split("/")[2];
    var dob = new Date(actual).getTime();
    var today = new Date().getTime();
    var age = (today - dob) / 1000;
    return await m.sendReply("```" + TimeCalculator(age) + "```");
  }
);
Module(
  {
    pattern: "cntd ?(.*)",
    desc: "Counts Date",
    use: "utility",
  },
  async (m, t) => {
    if (!t[1]) return await m.sendReply("_Give me a future date!_");
    if (
      !/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/.test(t[1])
    )
      return await m.sendReply("_Date must be in dd/mm/yy format_");
    var DOB = t[1];
    var actual = DOB.includes("-")
      ? DOB.split("-")[1] + "-" + DOB.split("-")[0] + "-" + DOB.split("-")[2]
      : DOB.split("/")[1] + "-" + DOB.split("/")[0] + "-" + DOB.split("/")[2];
    var dob = new Date(actual).getTime();
    var today = new Date().getTime();
    var age = (dob - today) / 1000;
    return await m.sendReply("_" + TimeCalculator(age) + " remaining_");
  }
);
Module({
    pattern: 'ping',
    desc: 'Interface système complète avec audio PTT',
    fromMe: false,
    type: 'general'
}, async (message) => {
    try {
        const start = new Date().getTime();

        await message.react('⏳');
        const { key } = await message.sendReply("⚙️ *SYNAPSE-OS* : Initialisation du kernel...");

        const bootSteps = [
            "⚡ 💽 [░░░░░░░░░░] 0%",
            "⚡ 💽 [▓▓░░░░░░░░] 25%",
            "⚡ 💽 [▓▓▓▓▓░░░░░] 55%",
            "⚡ 💽 [▓▓▓▓▓▓▓▓░░] 85%",
            "⚡ 💽 [▓▓▓▓▓▓▓▓▓▓] 100%"
        ];

        for (const step of bootSteps) {
            await new Promise(res => setTimeout(res, 400));
            await message.client.sendMessage(message.jid, { text: step, edit: key });
        }

        const end = new Date().getTime();
        const latence = end - start;

        const ramUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const platform = process.platform;
        const uptime = Math.floor(process.uptime() / 3600);

        const finalInterface = `
╭───〖 *S Y N A P S E - X* 〗───
│
│  🚀 *Vitesse* : \_${latence} ms\_
│
│  🖥️ *RAM* : \_${ramUsage} GB\_
│
│  📡 *Host* : \_${platform}\_
│
│  ⏳ *Uptime* : \_${uptime}h active\_
│
╰─────────────────────

> *Système en mode Hyper-Drive* ⚡`.trim();

        await message.client.sendMessage(message.jid, { 
            text: finalInterface, 
            edit: key 
        });

        await message.react('✅');
        await message.sendMessage({ url: 'https://ossynapse.netlify.app/audio/audio.mp3' }, 'audio', { ptt: true });

    } catch (e) {
        await message.react('❌');
        await message.sendReply(`_Erreur :_ \`${e.message}\``);
    }
});
