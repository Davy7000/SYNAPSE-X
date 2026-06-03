const { Module } = require('../main');
const { getTempPath } = require('../core/helpers');
const fs = require('fs');

const citations = [
    "La vie est un mystère qu'il faut vivre, et non un problème à résoudre.",
    "Le succès c'est d'aller d'échec en échec sans perdre son enthousiasme.",
    "La seule façon de faire du bon travail est d'aimer ce que vous faites.",
    "Soyez le changement que vous voulez voir dans le monde.",
    "La plus grande gloire n'est pas de ne jamais tomber, mais de se relever à chaque chute.",
    "Le bonheur n'est pas quelque chose de prêt à l'emploi. Il vient de vos propres actions.",
    "Croyez en vous-même et tout sera possible.",
    "La vie ne se mesure pas au nombre de respirations que nous prenons, mais aux moments qui nous coupent le souffle.",
    "Le seul endroit où le succès vient avant le travail, c'est dans le dictionnaire.",
    "Tout ce que l'esprit peut concevoir et croire, il peut l'accomplir.",
    "N'attendez pas. Le moment ne sera jamais parfait.",
    "Le courage c'est de savoir avoir peur et d'agir quand même.",
    "Votre temps est limité, ne le gâchez pas en vivant la vie de quelqu'un d'autre.",
    "La persévérance est la mère du succès.",
    "Un voyage de mille lieues commence toujours par un premier pas."
];

Module({
    pattern: 'quote',
    desc: 'Générer une citation motivante en note vocale',
    use: 'utilitaire',
    usage: 'quote'
}, async (message) => {
    try {
        await message.react('⏳');

        const citation = citations[Math.floor(Math.random() * citations.length)];
        const ttsUrl = `https://api.voicerss.org/?key=0d793190d99c464b9733b08152db1433&hl=fr-fr&src=${encodeURIComponent(citation)}&c=OGG&f=16khz_16bit_mono`;

        const { default: fetch } = await import('node-fetch');
        const res = await fetch(ttsUrl);
        const buffer = await res.buffer();

        const firstBytes = buffer.slice(0, 50).toString();
        if (firstBytes.includes('ERROR') || firstBytes.includes('error')) {
            return message.sendReply(`_Erreur API VoiceRSS :_ \`${firstBytes}\``);
        }

        const outputPath = getTempPath('quote.ogg');
        fs.writeFileSync(outputPath, buffer);

        await message.sendReply(`_"${citation}"_`);
        await message.sendMessage({ stream: fs.createReadStream(outputPath) }, 'audio', { ptt: true });
        await message.react('✅');

        fs.unlinkSync(outputPath);

    } catch (e) {
        await message.react('❌');
        await message.sendReply(`_Erreur :_ \`${e.message}\``);
    }
});