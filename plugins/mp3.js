const { Module } = require('../main');
const { getTempPath } = require('../core/helpers');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

Module({
    pattern: 'mp3 ?(.*)',
    desc: 'Extraire l\'audio d\'une vidéo en note vocale',
    use: 'Media',
    usage: 'mp3 (répondre à une vidéo ou fournir un lien)'
}, async (message, match) => {
    const replied = message.reply_message;
    const url = match[1] ? match[1].trim() : null;

    if (!replied?.video && !url) return message.sendReply('_Réponds à une vidéo ou fournis un lien avec_ `.mp3 <url>`');

    try {
        await message.react('⏳');

        let inputPath;

        if (replied?.video) {
            inputPath = await replied.download();
        } else {
            const { default: fetch } = await import('node-fetch');
            const res = await fetch(url);
            if (!res.ok) return message.sendReply('_Lien invalide ou inaccessible._');
            inputPath = getTempPath('input.mp4');
            const buffer = await res.buffer();
            fs.writeFileSync(inputPath, buffer);
        }

        const outputPath = getTempPath('audio.ogg');

        await new Promise((resolve, reject) => {
            ffmpeg(inputPath)
                .noVideo()
                .audioCodec('libopus')
                .format('ogg')
                .save(outputPath)
                .on('end', resolve)
                .on('error', reject);
        });

        await message.sendMessage({ stream: fs.createReadStream(outputPath) }, 'audio', { ptt: true });
        await message.react('✅');

        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);

    } catch (e) {
        await message.react('❌');
        await message.sendReply(`_Erreur lors de l'extraction :_ \`${e.message}\``);
    }
});