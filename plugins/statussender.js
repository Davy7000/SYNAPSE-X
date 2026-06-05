//pattern: 'status_sender',

// Matching keywords
const snds = "send,snd,snt,sent,ayak,ayk,gev,envoi,envoie"

// Custom message to be sent along with status
const MSG = ""; 

const {Module} = require('../main');
const sends = snds.split(",");

Module({on: 'text', fromMe: false}, async (message) => {
    if (!message.reply_message || message.quoted.key.remoteJid !== 'status@broadcast') return;
    if (sends.some(keyword => message.message.toLowerCase().includes(keyword))) {
        return await message.forwardMessage(message.jid, message.quoted, {contextInfo: {isForwarded: false}});
    }
});