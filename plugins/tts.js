const { Module } = require('../main');

Module({
    pattern: 'tts ?(.*)',
    fromMe: false,
    desc: 'Convertit un texte en fichier audio',
    use: 'misc',
    usage: 'tts <message>'
}, async (message, match) => {
    const text = match[1]?.trim();

    if (!text) {
        return await message.sendReply(
            `*Conseils d'utilisation :*\n\n` +
            `› \`tts Bonjour tout le monde\`\n` +
            `› \`tts Comment vas-tu ?\`\n` +
            `› Le texte est converti en fichier audio en français`
        );
    }

    try {
        await message.react('⏳');

        const encoded = encodeURIComponent(text);
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=fr&client=tw-ob`;

        const response = await fetch(url, {
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