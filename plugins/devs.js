const { Module } = require('../main');
const config = require('../config');

const isPrivateBot = config.MODE !== 'public';

Module({
    pattern: 'devs',
    fromMe: isPrivateBot,
    desc: 'Présenter les développeurs officiels du projet Synapse-X',
    use: 'oss'
}, async (message, match) => {
    try {
        let ownerMessage = `👑 *[ FONDATEURS SYNAPSE-X ]* 👑\n`;
        ownerMessage += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
        
        ownerMessage += `🧠 *T W I L I G H T ³₆⁹ 모* (Génie Concepteur)\n`;
        ownerMessage += `• *Rôle :* Développeur Principal & Architecte Core\n`;
        ownerMessage += `• *Spécialité :* Logique système, optimisation VPS & infrastructure\n\n`;
        
        ownerMessage += `✨ *K A R M A ³₆⁹ 모* (Génie Concepteur)\n`;
        ownerMessage += `• *Rôle :* Concepteur UI/UX & Intégrateur de Modules\n`;
        ownerMessage += `• *Spécialité :* Gestion des flux, Design & interactivité\n\n`;

        ownerMessage += `✨ *P S Y G E R S ³₆⁹ 모* (Génie Concepteur)\n`;
        ownerMessage += `• *Rôle :* Community Manager\n`;
        ownerMessage += `• *Spécialité :* Charger de la communauté et de la gestion du personnel\n\n`;
        
        ownerMessage += `🏢 *Organisation :* OSS Company\n\n`;
        ownerMessage += `🇨🇬 *Origine :* République du Congo\n`;
        ownerMessage += `━━━━━━━━━━━━━━━━━━━━━\n`;
        ownerMessage += `> 💡 _L'innovation n'est rien sans une exécution parfaite._\n`;
        ownerMessage += `> *Propulsé par l'OSS Company* 🌐 https://ossynapse.netlify.app/oss_company\n`;

        await message.sendReply(ownerMessage);

    } catch (error) {
        console.error('Erreur dans le plugin owner :', error);
        await message.sendReply('❌ Une erreur est survenue lors de l\'affichage des informations des développeurs.');
    }
});
