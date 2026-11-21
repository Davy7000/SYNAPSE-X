const { Module } = require('../main');

Module({
    pattern: 'save ?(.*)',
    fromMe: true,
    desc: 'Envoie le message ou média cité vers tes DM ou un numéro spécifique',
    use: 'utility',
    usage: '.save ou .save 242xxxxxxx'
}, async (message, match) => {
    if (!message.reply_message) return await message.sendReply('_Répondez à un message ou un média pour l\'enregistrer_');

    // Détermine la cible : le numéro fourni ou ton propre compte (DM)
    const targetJid = match[1] && match[1].length > 5 
        ? match[1].replace(/[^0-9]/g, '') + '@s.whatsapp.net' 
        : message.myjid;

    const msg = message.reply_message;
    const caption = msg.caption ? msg.caption : '';

    try {
        if (msg.image || msg.video || msg.audio || msg.sticker || msg.document) {
            const buffer = await msg.download('buffer');
            let type = '';
            let options = { jid: targetJid };

            if (msg.image) type = 'image';
            if (msg.video) type = 'video';
            if (msg.sticker) type = 'sticker';
            if (msg.audio) {
                type = 'audio';
                options.ptt = msg.data.audioMessage?.ptt || false;
            }
            if (msg.document) {
                type = 'document';
                options.mimetype = msg.mimetype;
                options.fileName = msg.data.documentMessage?.title || 'file';
            }

            // Envoi du média vers le DM cible
            await message.client.sendMessage(targetJid, { 
                [type]: buffer, 
                caption: caption,
                ...options 
            });
        } else {
            // Envoi du texte simple vers le DM cible
            await message.client.sendMessage(targetJid, { text: msg.text });
        }

        await message.react('💾');
    } catch (error) {
        await message.sendReply('_Échec du transfert vers les DM._');
        console.error(error);
    }
});
