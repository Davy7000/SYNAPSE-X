const { Module } = require('../main');

Module({
    pattern: 'roulette',
    desc: 'Décide du destin d\'un membre tagué (1 chance sur 6 d\'être kické).',
    fromMe: true, // Seuls les admins ou le proprio peuvent "juger"
    type: 'admin'
}, async (message) => {
    if (!message.isGroup) return await message.sendReply("❌ Uniquement en groupe.");

    // 1. Récupérer la personne taguée ou citée
    const target = message.mention[0] || (message.reply_message ? message.reply_message.sender : null);

    if (!target) {
        return await message.sendReply("⚠️ Tague la personne à juger ou réponds à son message avec .roulette");
    }

    // 2. Vérifier si le bot est admin
    const groupMetadata = await message.client.groupMetadata(message.jid);
    const botId = message.client.user.id.split(':')[0] + '@s.whatsapp.net';
    const botIsAdmin = groupMetadata.participants.find(p => p.id === botId)?.admin !== null;

    if (!botIsAdmin) {
        return await message.sendReply("⚠️ Je dois être admin pour exécuter une sentence.");
    }

    // 3. Le Jugement
    await message.client.sendMessage(message.jid, { 
        text: `⚖️ *TRIBUNAL DE SYNAPSE-X*\n\n@${target.split('@')[0]}, ton destin est entre mes mains...`,
        mentions: [target]
    });

    await new Promise(res => setTimeout(res, 2000));
    const chance = Math.floor(Math.random() * 6) + 1;

    if (chance === 1) {
        // SENTENCE DE MORT
        await message.client.sendMessage(message.jid, { 
            text: `💥 *VERDICT : COUPABLE !*\n\nLa balle a trouvé sa cible. Adieu @${target.split('@')[0]}.`,
            mentions: [target]
        });
        
        await new Promise(res => setTimeout(res, 1000));
        try {
            await message.client.groupParticipantsUpdate(message.jid, [target], "remove");
        } catch (e) {
            await message.sendReply("❌ Impossible d'expulser cet individu (Hiérarchie admin).");
        }
    } else {
        // GRÂCE PRÉSIDENTIELLE
        await message.client.sendMessage(message.jid, { 
            text: `🍀 *VERDICT : INNOCENT !*\n\nLe barillet était vide. @${target.split('@')[0]}, tu as une seconde chance. Ne la gâche pas !`,
            mentions: [target]
        });
    }
});