const { Module } = require('../main');

// Variable en mémoire (Activé par défaut)
let isTagBotActive = false;

// Commande de configuration et d'aide
Module({
    pattern: 'tagbot ?(.*)',
    fromMe: true,
    desc: 'Contrôle et aide du système de réponse au tag',
    use: 'utility',
    usage: '.tagbot on | .tagbot off | .tagbot help'
}, async (message, match) => {
    const input = match[1].toLowerCase().trim();

    if (input === 'on') {
        isTagBotActive = true;
        return await message.sendReply('_Réponse au tag activée ✅_');
    } 
    if (input === 'off') {
        isTagBotActive = false;
        return await message.sendReply('_Réponse au tag désactivée ❌_');
    }

    // Instructions d'utilisation détaillées
    const helpText = `*───「 TAGBOT SYSTEM 」───*

_Ce plugin permet au bot de répondre automatiquement avec une vidéo lorsqu'il est mentionné dans un groupe._

*COMMANDES DISPONIBLES :*
• \`.tagbot on\` : Active la réponse automatique.
• \`.tagbot off\` : Désactive la réponse automatique.
• \`.tagbot help\` : Affiche ce menu d'aide.

*COMMENT L'UTILISER :*
1. Assurez-vous que le bot est présent dans le groupe.
2. N'importe quel membre peut taguer le bot (ex: *@Bot*).
3. Le bot répondra instantanément avec la vidéo configurée.

*STATUT ACTUEL :* ${isTagBotActive ? '*Activé ✅*' : '*Désactivé ❌*'}

_Note : Pour changer la vidéo, modifiez le lien dans le fichier source du plugin. Mais il faut l'autorisation de Twilight ou Karma_`;

    return await message.sendReply(helpText);
});

// Écouteur de tag
Module({
    on: 'text',
    fromMe: false,
    handler: false
}, async (message, match) => {
    
    if (!isTagBotActive) return;

    const botJid = message.myjid;
    const isTagged = message.mention && message.mention.includes(botJid);

    if (isTagged) {
        // --- LIEN DE TA VIDÉO ICI ---
        const videoUrl = 'https://ossynapse.netlify.app/video/video.mp4'; 

        try {
            await message.sendMessage(
                { url: videoUrl },
                'video',
                { 
                    caption: `_Je suis là ! Que puis-je faire pour vous ?_`,
                    mentions: [message.sender],
                    quoted: message.data 
                }
            );
        } catch (error) {
            await message.sendReply('_Je suis là ! 👋_');
        }
    }
});
