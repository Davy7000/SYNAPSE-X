const { Module } = require('../main');

Module({
    pattern: 'gstats',
    desc: 'Statistiques complètes du groupe',
    use: 'group',
    usage: 'stats'
}, async (message) => {
    if (!message.isGroup) return message.sendReply('_Cette commande fonctionne uniquement dans un groupe._');

    const metadata = await message.client.groupMetadata(message.jid);
    const admins = metadata.participants.filter(p => p.admin !== null).map(p => p.id);

    if (!admins.includes(message.sender)) return message.sendReply('_Cette commande est réservée aux admins du groupe._');

    try {
        await message.react('⏳');

        const totalMembers = metadata.participants.length;
        const totalAdmins = admins.length;
        const totalSimples = totalMembers - totalAdmins;
        const groupName = metadata.subject;
        const description = metadata.desc || 'Aucune description';
        const creation = new Date(metadata.creation * 1000).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });

        const interface_stats = `
╭────〖 *S T A T S* 〗─────
│
│  📛 *Nom* : \ ${groupName}\
│
│  📝 *Description* : \_${description}\_
│
│  📅 *Créé le* : \ ${creation}\
│
│  👥 *Membres* : \*${totalMembers}\*
│
│  👑 *Admins* : \*${totalAdmins}\*
│
│  👤 *Simples* : \*${totalSimples}\*
│
╰───────────────────

> *Rapport généré par Synapse-X* `.trim();

        await message.sendReply(interface_stats);
        await message.react('✅');

    } catch (e) {
        await message.react('❌');
        await message.sendReply(`_Erreur lors de la récupération des stats :_ \`${e.message}\``);
    }
});