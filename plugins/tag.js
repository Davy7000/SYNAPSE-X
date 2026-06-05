const { Module } = require('../main');
const config = require('../config');
const isPrivateBot = config.MODE !== 'public';

// Variable en mémoire (Désactivé par défaut)
let isTagBotActive = false;

// Commande de configuration et d'aide
Module({
    pattern: 'tagbot ?(.*)',
    fromMe: isPrivateBot, // Alignement sur ton mode public/privé global
    desc: 'Contrôle et aide du système de réponse au tag',
    type: 'utility', // Corrigé : 'use' est devenu 'type' pour respecter tes normes
    usage: '.tagbot on | .tagbot off | .tagbot help'
}, async (message, match) => {
    const input = match[1]?.toLowerCase().trim();

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

_Ce plugin permet au bot de répondre automatiquement avec une vidéo lorsqu'il est mentionné ou quand tout le monde est tagué dans un groupe._

*COMMANDES DISPONIBLES :*
• \`.tagbot on\` : Active la réponse automatique.
• \`.tagbot off\` : Désactive la réponse automatique.
• \`.tagbot help\` : Affiche ce menu d'aide.

*COMMENT L'UTILISER :*
1. Assurez-vous que le bot est présent dans le groupe.
2. N'importe quel membre peut taguer le bot (ex: *@Bot*) ou mentionner le groupe (ex: *@tous*).
3. Le bot répondra instantanément avec la vidéo configurée.

*STATUT ACTUEL :* ${isTagBotActive ? '*Activé ✅*' : '*Désactivé ❌*'}

_Note : Pour changer la vidéo, modifiez le lien dans le fichier source du plugin. Mais il faut l'autorisation de Twilight ou Karma 🇨🇬_`;

    return await message.sendReply(helpText);
});

// Écouteur de tag et mentions globales
Module({
    on: 'text',
    fromMe: false,
    handler: false
}, async (message, match) => {
    
    if (!isTagBotActive) return;

    const botJid = message.myjid;
    
    // 1. Détection du tag direct du Bot
    const isTagged = message.mention && message.mention.includes(botJid);

    // 2. Détection du tag global textuel (@tous, @Tous, @everyone)
    const textContent = message.text ? message.text.toLowerCase() : "";
    const isTagTous = textContent.includes('@tous') || textContent.includes('@everyone');

    // Le bot se déclenche si l'une des deux conditions est vraie
    if (isTagged || isTagTous) {
        // --- LIEN DE TA VIDÉO ICI ---
        const videoUrl = 'https://ossynapse.netlify.app/video/video.mp4'; 

        try {
            await message.sendMessage(
                { url: videoUrl },
                'video',
                { 
                    caption: `> _Salut Je suis là. Qui vient de me taguer et Que puis-je faire pour vous ?_`,
                    mentions: [message.sender],
                    quoted: message.data 
                }
            );
        } catch (error) {
            console.error("Erreur d'envoi de la vidéo TagBot :", error);
            await message.sendReply('_Je suis là ! 👋_');
        }
    }
});
