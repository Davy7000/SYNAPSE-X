const { Module } = require('../main');
const config = require('../config');
const axios = require('axios');

const isPrivateBot = config.MODE !== 'public';

/*===================================================================================
  ████████   EDITABLE SECTION   ████████
  Only change the values between these lines!
===================================================================================*/

const OWNER_DETAILS = {
    name: '𝑻𝒘𝒊𝒍𝒊𝒈𝒉𝒕_𝑲𝒊𝒏𝒈☯❥',
    title: 'Administrateur',
    number: '242050336960',
    body: 'oss compagny',
    image: "https://i.ibb.co/PZdr7GK6/temp.jpg",
    thumbnailUrl: 'https://gist.github.com/'
};

/*===================================================================================
  ████████   END OF EDITABLE SECTION   ████████
  Do NOT modify anything below this point!
===================================================================================*/

// Owner command for SYNAPSE-X style
Module({
    pattern: 'owner',
    fromMe: isPrivateBot,
    desc: 'Bot Owner',
    type: 'user'
}, async (message, match) => {
    try {
        // Thumbnail as buffer if supported, else null
        let thumbnailBuffer = null;
        try {
            const imgRes = await axios.get(OWNER_DETAILS.image, { responseType: 'arraybuffer' });
            thumbnailBuffer = Buffer.from(imgRes.data, 'binary');
        } catch (e) {}

        // vCard format
        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${OWNER_DETAILS.name}
TEL;type=CELL;type=VOICE;waid=${OWNER_DETAILS.number}:${OWNER_DETAILS.number}
END:VCARD`;

        await message.client.sendMessage(message.jid, {
            contacts: {
                contacts: [{ vcard }]
            },
            contextInfo: { 
                externalAdReply: {
                    title: OWNER_DETAILS.title,
                    body: OWNER_DETAILS.body,
                    thumbnailUrl: OWNER_DETAILS.thumbnailUrl,
                    mediaUrl: OWNER_DETAILS.thumbnailUrl,
                    mediaType: 1,
                    showAdAttribution: false,
                    renderLargerThumbnail: false,
                    thumbnail: thumbnailBuffer
                }
            }
        });
    } catch (error) {
        console.error('Error occurred:', error);
        await message.client.sendMessage(message.jid, { text: 'Error occurred while executing the command.' });
    }
});