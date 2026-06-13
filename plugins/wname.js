const { Module } = require('../main');

Module({
    pattern: 'wname ?(.*)',
    fromMe: true,
    desc: 'Changer le nom WhatsApp',
    use: 'owner',
    usage: 'wname <nouveau nom>'
}, async (message, match) => {
    const replied = message.reply_message;
    const newName = match[1] ? match[1].trim() : replied?.text?.trim() || null;

    if (!newName) return message.sendReply('_Fournis un nom ou réponds à un message. Exemple :_ `.wname alex003`');

    try {
        await message.react('⏳');
        await message.client.updateProfileName(newName);
        await message.react('✅');
        await message.sendReply(`_Nom mis à jour :_ \`${newName}\``);
    } catch (e) {
        await message.react('❌');
        await message.sendReply(`_Erreur :_ \`${e.message}\``);
    }
});