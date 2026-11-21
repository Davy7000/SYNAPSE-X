const { Module } = require('../main');

// Stockage en mémoire (reset au redémarrage du bot)
let kingVotes = {}; 

Module({
    pattern: 'vote',
    fromMe: false,
    desc: 'Vote pour le King du groupe',
    type: 'fun'
}, async (message, match) => {
    if (!message.isGroup) return await message.sendReply("_Uniquement en groupe ! 👑_");
    
    const voter = message.sender;
    const target = message.mention[0] || (message.reply_message && message.reply_message.sender);

    if (!target) return await message.sendReply("_Mentionne la personne pour qui tu votes ! ✨_");
    if (target === voter) return await message.sendReply("_Tu ne peux pas voter pour toi-même, petit malin ! 😂_");

    const groupJid = message.jid;
    if (!kingVotes[groupJid]) kingVotes[groupJid] = { voters: {}, scores: {} };

    // Vérifier si l'utilisateur a déjà voté
    if (kingVotes[groupJid].voters[voter]) {
        return await message.sendReply("_Tu as déjà donné ton vote pour aujourd'hui ! 🗳️_");
    }

    // Enregistrer le vote
    kingVotes[groupJid].voters[voter] = target;
    kingVotes[groupJid].scores[target] = (kingVotes[groupJid].scores[target] || 0) + 1;

    const targetName = message.mention[0] ? `@${target.split('@')[0]}` : "ce membre";
    await message.client.sendMessage(message.jid, {
        text: `✅ Vote enregistré ! +1 point pour ${targetName}.`,
        mentions: [target]
    });
});

Module({
    pattern: 'king',
    fromMe: false,
    desc: 'Affiche le Roi du groupe',
    type: 'fun'
}, async (message) => {
    const groupJid = message.jid;
    const data = kingVotes[groupJid];

    if (!data || Object.keys(data.scores).length === 0) {
        return await message.sendReply("_Personne n'a encore voté. Soyez les premiers à désigner un King ! 👑_");
    }

    // Trier les scores
    const sorted = Object.entries(data.scores)
        .map(([jid, score]) => ({ jid, score }))
        .sort((a, b) => b.score - a.score);

    const winner = sorted[0];
    const mentionWinner = `@${winner.jid.split('@')[0]}`;

    let response = `👑 *LE TRÔNE DU GROUPE* 👑\n`;
    response += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    response += `✨ *KING ACTUEL :* ${mentionWinner}\n`;
    response += `🔥 *Puissance :* ${winner.score} votes\n\n`;
    
    if (sorted.length > 1) {
        response += `*Le reste du podium :*\n`;
        sorted.slice(1, 5).forEach((p, i) => {
            response += `${i + 2}. @${p.jid.split('@')[0]} (${p.score} pts)\n`;
        });
    }

    response += `\n━━━━━━━━━━━━━━━━━━━━\n`;
    response += `🗳️ *Tapez .vote pour changer le destin !*`;

    await message.client.sendMessage(message.jid, {
        text: response,
        mentions: sorted.map(s => s.jid)
    }, { quoted: message.data });
});

Module({
    pattern: 'resetking',
    fromMe: true, // Seul toi (le sudo) peut reset
    desc: 'Réinitialise les votes du King',
    type: 'fun'
}, async (message) => {
    delete kingVotes[message.jid];
    await message.sendReply("_Le trône est désormais vide. Les compteurs sont à zéro ! 🏛️_");
});