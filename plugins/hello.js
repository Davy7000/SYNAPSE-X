const { Module } = require('../main');
const config = require('../config');
const isPrivateBot = config.MODE !== 'public';

Module({
    pattern: 'teddy ?(.*)',
    fromMe: isPrivateBot,
    desc: "Envoie un ours animé avec un bombardement d'amour signé Synapse X",
    type: 'fun'
}, async (message, match) => {
    // Liste enrichie d'emojis pour l'animation
    let emo = [
    //  Magie, Fête, Câlins et Cadeaux
    '✨', '🔥', '💫', '🌟', '⭐', '🎈', '🎉', '🎊', '🎁', '🎀', 
    '💌', '💎', '👑', '💋', '🫂', '🕊️', '🪄', '🥂', '🍾',

    //  Visages et Affection
    '🥰', '😍', '🤩', '😘', '😗', '😚', '😋', '🤗', '🫣', '🤭', '🫠',

    //  Teddies et Animaux Mignons
    '🧸', '🐼', '🐨', '🐰', '🐱', '🦊', '🦄', '🐣', '🦔', '🐥',

    //  Fleurs et Nature
    '🌹', '🌷', '🌸', '💐', '🌺', '🌻', '🌼', '🥀', '☘️', '🍀', 

     //  Cœurs et Amour
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💖', 
    '💝', '💘', '💕', '💞', '💓', '💗', '❣️', '💟', '❤️‍🔥', '❤️‍🩹'
];

    // Message d'envoi initial
    const sent_msg = await message.sendReply("*_Je t'aime trés fort_*");

    // Boucle d'animation
    for (let i = 0; i < emo.length; i++) {
        const emoji = emo[i];
        
        // Délai d'attente de 800ms
        await new Promise(res => setTimeout(res, 800));

        let teddy = `*(\\_/)*\n*( •.•)*\n*/>* 🤍`; 
        
        let messageAnime = teddy.replace("🤍", emoji);

        // Touche personnelle : Signature finale ancrée grâce au symbole ">"
        if (i === emo.length - 1) {
            messageAnime += `\n\n` +
                
               `> *_Je t'aime trés fort_*\n`;
        }

        // Modification en temps réel
        await message.edit(messageAnime, message.jid, sent_msg.key);
    }
});
