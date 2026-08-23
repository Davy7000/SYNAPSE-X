'use strict';

const { Module } = require("../main");

Module(
  {
    pattern: "couple",
    fromMe: false,
    desc: "Sélectionne aléatoirement le couple du jour dans le groupe",
    usage: ".couple",
    use: "group",
  },
  async (message) => {
    if (!message.isGroup) {
      return await message.sendReply("_❌ Cette commande fonctionne uniquement dans un groupe !_");
    }

    try {
      // Récupération de la liste des membres du groupe
      const groupMetadata = await message.client.groupMetadata(message.jid);
      const participants = groupMetadata.participants;

      if (participants.length < 2) {
        return await message.sendReply("_❌ Il faut au moins 2 membres dans le groupe pour former un couple !_");
      }

      // Sélection aléatoire de deux membres distincts
      const randomIndex1 = Math.floor(Math.random() * participants.length);
      let randomIndex2 = Math.floor(Math.random() * participants.length);

      while (randomIndex2 === randomIndex1) {
        randomIndex2 = Math.floor(Math.random() * participants.length);
      }

      const user1 = participants[randomIndex1].id;
      const user2 = participants[randomIndex2].id;

      const coupleText = 
        `👩‍❤️‍👨 *LE COUPLE DU JOUR* 👨‍❤️‍👨\n\n` +
        `Les étoiles se sont alignées ! Félicitations à nos deux tourtereaux du jour : 🎉\n\n` +
        `👑 @${user1.split("@")[0]}\n` +
        `     ❤️ + ❤️\n` +
        `👑 @${user2.split("@")[0]}\n\n` +
        `✨ *Prophétie :* 99.9% de chances de finir ensemble ! 🌹\n` +
        `Offrez-leur une vague d'applaudissements ! 👏`;

      await message.client.sendMessage(
        message.jid,
        {
          text: coupleText,
          mentions: [user1, user2],
        },
        { quoted: message.data }
      );
    } catch (error) {
      console.error("Erreur Couple Plugin:", error);
      await message.sendReply("_❌ Impossible de récupérer les membres du groupe._");
    }
  }
);
