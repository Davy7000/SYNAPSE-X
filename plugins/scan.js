const { Module } = require('../main');
const { getTempPath } = require('../core/helpers');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

Module({
    pattern: 'scan ?(.*)',
    desc: 'Scanner le texte d\'une image via OCR.space',
    use: 'Media',
    usage: 'scan (répondre à une image ou envoyer une image avec la commande)'
}, async (message, match) => {
    const replied = message.reply_message;
    const hasImage = replied?.image || message.data?.message?.imageMessage;

    if (!hasImage) return message.sendReply('_Envoie une image ou réponds à une image avec_ `.scan` pour obtenir le texte de l\'image');

    try {
        await message.react('⏳');

        let buffer;
        if (replied?.image) {
            buffer = await replied.download('buffer');
        } else {
            buffer = await message.download('buffer');
        }

        const imagePath = getTempPath('scan.jpg');
        fs.writeFileSync(imagePath, buffer);

        const form = new FormData();
        form.append('file', fs.createReadStream(imagePath), 'scan.jpg');
        form.append('apikey', 'K89671631788957');
        form.append('language', 'fre');
        form.append('isOverlayRequired', 'false');
        form.append('detectOrientation', 'true');
        form.append('scale', 'true');
        form.append('OCREngine', '2');

        const response = await axios.post('https://api.ocr.space/parse/image', form, {
            headers: { ...form.getHeaders() },
            timeout: 30000
        });

        const result = response.data?.ParsedResults?.[0];

        if (!result || result.ParsedText.trim() === '') {
            await message.react('❌');
            fs.unlinkSync(imagePath);
            return message.sendReply('_Aucun texte détecté sur cette image ou image pas trop nette._');
        }

        const extractedText = result.ParsedText.trim();

        await message.sendReply(
            `╭───〖 *S C A N  IMAGE* 〗───\n│\n│  📄 *Texte détecté :*\n│\n${extractedText.split('\n').map(l => `│  ${l}`).join('\n')}\n│\n╰─────────────────────
> ℹ️_Attention le scan automatique peut comporter de légères erreurs selon la netteté de l'image_
`
        );

        await message.react('✅');
        fs.unlinkSync(imagePath);

    } catch (e) {
        await message.react('❌');
        await message.sendReply(`_Erreur lors du scan :_ \`${e.message}\``);
    }
});