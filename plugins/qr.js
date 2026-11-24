'use strict';

const { Module } = require('../main');
const config = require('../config');
const QRCode = require('qrcode');
const jsQR = require('jsqr');
const { Jimp } = require('jimp');

const isPrivateMode = config.MODE === 'private';
const handlerPrefix = config.HANDLERS !== 'false' ? config.HANDLERS.split('')[0] : '.';

async function decodeQrBuffer(imageBuffer) {
  const image = await Jimp.read(imageBuffer);
  const { data, width, height } = image.bitmap;
  const result = jsQR(new Uint8ClampedArray(data), width, height, {
    inversionAttempts: 'attemptBoth',
  });
  return result ? result.data : null;
}

Module(
  {
    pattern: 'qr ?(.*)',
    fromMe: isPrivateMode,
    use: 'utility',
    usage: 'qr <texte ou lien> (ou répondre à un message)',
    desc: 'Génère un QR code scannable à partir d’un texte, d’un lien ou d’un message cité.',
  },
  async (message, match) => {
    try {
      const textInput =
        (match && match[1] && match[1].trim()) ||
        (message.reply_message && message.reply_message.text && message.reply_message.text.trim()) ||
        '';

      if (!textInput) {
        return await message.sendReply(
          `╭──〖 *G É N É R A T E U R  Q R* 〗─\n` +
          `│\n` +
          `│ ❌ *Aucun texte ou lien détecté.*\n` +
          `│\n` +
          `│ 💡 *Exemples :*\n` +
          `│ • \`${handlerPrefix}qr https://github.com\`\n` +
          `│ • \`${handlerPrefix}qr SYNAPSE-X v2\`\n` +
          `│ • Réponds à une image QR avec \`${handlerPrefix}readqr\`\n` +
          `│\n` +
          `╰────────────────────`
        );
      }

      if (textInput.length > 1200) {
        return await message.sendReply(
          '_Le contenu est trop long pour générer un QR code lisible (max 1200 caractères)._'
        );
      }

      await message.react('⏳');

      const qrBuffer = await QRCode.toBuffer(textInput, {
        type: 'png',
        width: 600,
        margin: 2,
        errorCorrectionLevel: 'M',
        color: {
          dark: '#090D16',
          light: '#FFFFFF',
        },
      });

      const caption =
        `╭─〖 *S Y N A P S E - X  Q R* 〗───\n` +
        `│\n` +
        `│ ✅ *QR Code généré avec succès*\n` +
        `│ 📝 *Contenu :* \`${textInput.length > 140 ? textInput.slice(0, 140) + '...' : textInput}\`\n` +
        `│\n` +
        `╰──────────────────────`;

      await message.client.sendMessage(
        message.jid,
        {
          image: qrBuffer,
          mimetype: 'image/png',
          caption,
        },
        { quoted: message.data }
      );

      await message.react('✅');
    } catch (err) {
      console.error('Erreur Plugin QR:', err);
      await message.react('❌');
      await message.sendReply(`_Erreur lors de la génération du QR code :_ \`${err.message || err}\``);
    }
  }
);

Module(
  {
    pattern: '(?:readqr|decodeqr) ?(.*)',
    fromMe: isPrivateMode,
    use: 'utility',
    usage: 'readqr (en répondant à une image QR)',
    desc: 'Lit et décode le contenu d’une image QR code en réponse.',
  },
  async (message) => {
    try {
      const quoted = message.reply_message;
      const isQuotedImage =
        quoted &&
        (quoted.image ||
          quoted.message?.imageMessage ||
          quoted.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage);

      if (!quoted || !isQuotedImage) {
        return await message.sendReply(
          `╭─〖 *L E C T E U R  Q R* 〗─\n` +
          `│\n` +
          `│ ❌ *Réponds à une image contenant un QR code.*\n` +
          `│\n` +
          `│ 💡 *Usage :* \`${handlerPrefix}readqr\` ou \`${handlerPrefix}decodeqr\`\n` +
          `│\n` +
          `╰─────────────────`
        );
      }

      await message.react('⏳');

      const downloaded = await quoted.download();
      const buffer = Buffer.isBuffer(downloaded) ? downloaded : Buffer.from(downloaded);
      const decodedData = await decodeQrBuffer(buffer);

      if (!decodedData) {
        await message.react('❌');
        return await message.sendReply(
          '_Aucun QR code lisible détecté dans cette image. Essaie avec une image plus nette ou bien cadrée._'
        );
      }

      const decodedCard =
        `╭─〖 *Q R  D É C O D É* 〗─\n` +
        `│\n` +
        `│ ✅ *Contenu extrait :*\n` +
        `│ \`${decodedData}\`\n` +
        `│\n` +
        `╰──────────────────`;

      await message.sendReply(decodedCard);
      await message.react('✅');
    } catch (err) {
      console.error('Erreur Lecture QR:', err);
      await message.react('❌');
      await message.sendReply(`_Erreur lors de la lecture du QR code :_ \`${err.message || err}\``);
    }
  }
);