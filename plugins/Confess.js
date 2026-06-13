const { Module } = require('../main');

// Stockage des groupes actifs et des personnes ayant déjà confessé
let activeGroups = {};
let alreadyConfessed = {}; // Format: { "ID_DU_GROUPE": ["USER1", "USER2"] }

Module({
    pattern: 'confess',
    fromMe: false,
    desc: 'Active le mode confession pour le groupe',
    use: 'group'
}, async (message) => {
    const groupId = message.jid;
    const groupName = (await message.client.groupMetadata(groupId)).subject;

    // On active le groupe et on vide la liste des gens qui ont déjà confessé pour ce groupe
    activeGroups[groupId] = { name: groupName };
    alreadyConfessed[groupId] = []; 

    const botNumber = message.client.user.id.split(':')[0];
    const botLink = `https://wa.me/${botNumber}`;

    await message.sendReply(`🤫 *MODE CONFESSION ACTIVÉ*\n\nLe mur des secrets est ouvert pour *${groupName}* !\n\n⚠️ *Règle :* Une seule confession par personne.\n\nÉcrivez-moi ici :\n👉 ${botLink}`);
});

Module({
    on: 'text',
    fromMe: false
}, async (message) => {
    if (message.isGroup) return;

    const userId = message.sender;
    const activeGroupJids = Object.keys(activeGroups);
    
    if (activeGroupJids.length === 0) return;

    // On prend le dernier groupe où le mode a été activé
    const latestGroupId = activeGroupJids[activeGroupJids.length - 1];
    const session = activeGroups[latestGroupId];

    // Ignorer les commandes
    if (message.text.startsWith('.') || message.text.startsWith('!') || message.text.startsWith('/')) return;

    // 🚪 VÉRIFICATION DE LA PORTE : Est-ce que la personne a déjà confessé ?
    if (alreadyConfessed[latestGroupId].includes(userId)) {
        return await message.sendReply(`❌ *Accès refusé.*\n\nTu as déjà envoyé ta confession pour le groupe *${session.name}*. Pour éviter le spam, c'est une seule fois par session !`);
    }

    try {
        // Envoi du secret
        await message.client.sendMessage(latestGroupId, {
            text: `🤫 *NOUVELLE CONFESSION ANONYME*\n\n« ${message.text} »\n\n━━━━━━━━━━━━━━━━━━━━\n_La porte s'est refermée pour cet utilisateur._`
        });

        // On marque l'utilisateur comme ayant déjà participé
        alreadyConfessed[latestGroupId].push(userId);

        await message.sendReply(`✅ Ton secret a été posté. La porte est maintenant fermée pour toi dans *${session.name}* !`);
    } catch (e) {
        console.error("Erreur confession:", e);
    }
});
