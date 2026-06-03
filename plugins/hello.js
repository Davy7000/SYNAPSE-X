const { Module } = require('../main');
const config = require('../config');
const isPrivateBot = config.MODE !== 'public';

Module({
    pattern: 'hello ?(.*)',
    fromMe: isPrivateBot,
    desc: 'Says hello',
    type: 'misc'
}, async (message, match) => {
    await message.sendReply(`Salut Boss je suis Synapse-X prêt pour vous servire`);
});