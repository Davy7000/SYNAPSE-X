const { Module } = require('../main');

Module({
    pattern: 'poll ?(.*)',
    fromMe: false,
    desc: 'Crée un sondage interactif',
    type: 'group'
}, async (message, match) => {
    try {
        // 1. Vérifier si on est dans un groupe
        if (!message.isGroup) return await message.sendReply("_Cette commande est réservée aux groupes._");

        // 2. Analyser l'entrée (Format: Question | Option1 | Option2 | ...)
        const input = match[1];
        if (!input || !input.includes('|')) {
            return await message.sendReply("_Format : .poll Question | Choix 1 | Choix 2_");
        }

        const parts = input.split('|').map(p => p.trim());
        const question = parts[0];
        const options = parts.slice(1);

        // 3. Validation des options
        if (options.length < 2) {
            return await message.sendReply("_Veuillez fournir au moins deux options._");
        }
        if (options.length > 12) {
            return await message.sendReply("_Maximum 12 options autorisées._");
        }

        // 4. Envoi du sondage natif
        await message.client.sendMessage(message.jid, {
            poll: {
                name: question,
                values: options,
                selectableCount: 1 // 1 pour un choix unique, supérieur pour choix multiples
            }
        });

    } catch (error) {
        console.error('Erreur POLL:', error);
        return await message.sendReply('❌ Impossible de créer le sondage.');
    }
});