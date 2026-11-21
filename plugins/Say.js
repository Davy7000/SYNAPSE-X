const { Module } = require('../main');

const translateText = async (text, targetLang = 'fr') => {
    const encoded = encodeURIComponent(text);
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encoded}`;
    const response = await fetch(url);
    const data = await response.json();
    return data[0].map(item => item[0]).join('');
};

Module({
    pattern: 'dit ?(.*)',
    fromMe: false,
    desc: 'Convertit un texte en fichier audio ou traduit un message répondu',
    use: 'misc',
    usage: 'dit <message> ou tts (en répondant à un message)'
}, async (message, match) => {
    const input = match[1]?.trim();
    const reply = message.reply_message;

    let text = input;

    if (!text && reply) {
        const replyText = reply.text || reply.caption || '';
        if (!replyText) return await message.sendReply('_Aucun texte trouvé dans le message cité._');
        text = replyText;
    }

    if (!text) {
        return await message.sendReply(
            `*Conseils d'utilisation :*\n\n` +
            `› \`dit Bonjour tout le monde\` — convertit le texte en audio\n` +
            `› Réponds à un message avec \`dit\` — traduit et convertit en audio\n` +
            `› Le texte est automatiquement traduit en français si nécessaire`
        );
    }

    try {
        await message.react('⏳');

        const translated = await translateText(text, 'fr');

        if (reply && translated !== text) {
            await message.sendReply(`_Traduction :_ ${translated}`);
        }

        const encoded = encodeURIComponent(translated);
        const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=fr&client=tw-ob`;

        const response = await fetch(ttsUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        });

        if (!response.ok) {
            await message.react('❌');
            return await message.sendReply('_Erreur lors de la génération de l\'audio._');
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        await message.sendMessage(buffer, 'audio', {
            mimetype: 'audio/mpeg',
            fileName: 'audio.mp3',
            ptt: false
        });

        await message.react('✅');

    } catch (err) {
        await message.react('❌');
        await message.sendReply(`_Erreur : ${err.message}_`);
    }
});