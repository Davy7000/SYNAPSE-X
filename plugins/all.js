const { Module } = require('../main');

Module({
    pattern: 'acceptall',
    fromMe: false, // On vérifie les droits manuellement
    desc: 'Approuve toutes les demandes d\'adhésion en attente',
    use: 'admin'
}, async (message, match) => {
    try {
        // 1. Vérifications de sécurité
        if (!message.isGroup) return await message.sendReply('_Cette commande est réservée aux groupes._');

        const groupMetadata = await message.client.groupMetadata(message.jid);
        const participants = groupMetadata.participants;
        
        // Vérifier si l'utilisateur est admin ou sudo
        const isAdmin = participants.find(p => p.id === message.sender).admin !== null;
        const isSudo = message.sudo || message.fromMe;

        if (!isAdmin && !isSudo) {
            return await message.sendReply('_Seuls les admins peuvent approuver les demandes._');
        }

        // Vérifier si le bot est admin
        const isBotAdmin = participants.find(p => p.id === message.myjid).admin !== null;
        if (!isBotAdmin) return await message.sendReply('_Je dois être admin pour gérer les demandes._');

        // 2. Récupération des demandes en attente
        const pendingList = await message.client.groupRequestParticipantsList(message.jid);

        if (!pendingList || pendingList.length === 0) {
            return await message.sendReply('_Aucune demande d\'adhésion en attente._');
        }

        // 3. Approbation de toutes les demandes
        const jids = pendingList.map(user => user.jid);
        for (const jid of jids) {
            await message.client.groupRequestParticipantsUpdate(message.jid, [jid], 'approve');
        }

        // 4. Construction du message de confirmation avec mentions
        let mentions = jids;
        let tagList = jids.map(jid => `@${jid.split('@')[0]}`).join(' ');

        const responseText = `*✅ Demandes Approuvées !*\n\n*Nombre :* ${jids.length}\n*Nouveaux membres :* ${tagList}`;

        return await message.client.sendMessage(message.jid, {
            text: responseText,
            mentions: mentions
        }, { quoted: message.data });

    } catch (error) {
        console.error('Erreur AcceptAll :', error);
        
        if (error.message.includes('not-authorized')) {
            return await message.sendReply('_Erreur : Le bot n\'a pas les permissions nécessaires._');
        }
        return await message.sendReply('_Une erreur est survenue. Vérifiez si l\'approbation des membres est activée._');
    }
});