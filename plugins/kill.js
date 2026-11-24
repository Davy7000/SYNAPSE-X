'use strict';

const { Module } = require('../main');
const fs = require('fs');
const path = require('path');

Module(
  {
    pattern: 'kill ?(.*)',
    fromMe: true,
    use: 'owner',
    desc: 'Déconnecte le bot des appareils connectés WhatsApp et supprime la session locale.',
  },
  async (message, match) => {
    try {
      const confirm = (match && match[1] && match[1].trim().toLowerCase()) === 'confirm';

      if (!confirm) {
        return await message.sendReply(
          `⚠️ *Attention :* cette commande va déconnecter *SYNAPSE-X* de *Appareils connectés* sur WhatsApp et effacer la session locale.\n\n` +
          `Tape *${message.prefix || '.'}kill confirm* pour valider.`
        );
      }

      await message.react('💀');
      await message.sendReply('🔌 *Déconnexion en cours de WhatsApp (Appareils connectés)...*');

      const sock = message.client;
      const sessionDir = path.join(__dirname, '../session');

      // 1. Déconnexion propre côté WhatsApp
      if (sock && typeof sock.logout === 'function') {
        try {
          await sock.logout();
        } catch (logoutErr) {
          console.error('Erreur sock.logout():', logoutErr);
        }
      }

      // 2. Suppression sécurisée des fichiers de la session locale
      if (fs.existsSync(sessionDir)) {
        for (const file of fs.readdirSync(sessionDir)) {
          fs.rmSync(path.join(sessionDir, file), { recursive: true, force: true });
        }
      }

      // 3. Arrêt du processus (Pterodactyl / gestionnaire prendra le relais)
      setTimeout(() => {
        process.exit(0);
      }, 1500);
    } catch (err) {
      console.error('Erreur Plugin Kill:', err);
      await message.react('❌');
      await message.sendReply(`_Erreur lors de la déconnexion :_ \`${err.message || err}\``);
    }
  }
);