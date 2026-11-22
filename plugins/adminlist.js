// Made by bryt777

const { Module } = require("../main");

Module({

    pattern: "adminlist",

    fromMe: false,

    desc: "Lists all admins in the group",

    use: "group"

}, async (message, match) => {

    try {

        if (!message.isGroup) return await message.reply("_❌ This command works only in groups!_");

        const groupMetadata = await message.client.groupMetadata(message.jid);

        const admins = [];

        let owner = null;

        for (let participant of groupMetadata.participants) {

            if (participant.admin === "superadmin") {

                owner = participant.id;

            } else if (participant.admin === "admin") {

                admins.push(participant.id);

            }

        }

        let msg = "╭『 👑 *Admin List*』─◆\n";

        if (owner) msg += `\n*Owner:* @${owner.split('@')[0]}\n`;

        if (admins.length > 0) {

            msg += `\n*Admins:*\n`;

            admins.forEach((admin, i) => {

                msg += `${i + 1}. @${admin.split('@')[0]}\n`;

            });

        } else {

            msg += `\n_No other admins found._\n`;

        }

        msg += "╰────────────◆";

        await message.client.sendMessage(

            message.jid,

            { text: msg, mentions: [owner, ...admins] },

            { quoted: message.data }

        );

    } catch (err) {

        console.error(err);

        await message.reply("_⚠️ An error occurred while fetching the admin list._");

    }

});