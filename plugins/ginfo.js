const { Module } = require('../main');
const axios = require('axios');

Module({
    pattern: 'ginfo ?(.*)',
    fromMe: true,
    desc: 'Download group info with JID and profile pic',
    use: 'group'
}, async (message, match) => {
    let jid = match[1] || message.jid;

    if (!jid.endsWith('@g.us')) {
        return await message.sendReply(`*⚠️ Invalid Group JID!*
Format: 123456789@g.us
Current JID: ${message.jid}`);
    }

    try {
        // Get group metadata
        const groupMetadata = await message.client.groupMetadata(jid);

        // Format group info with clean markdown
        let info = `*_ℹ️ Group Details_*\n\n`;
        info += `*JID:* ${jid}\n`;
        info += `*Name:* ${groupMetadata.subject}\n`;
        info += `*Members:* ${groupMetadata.participants.length}\n`;
        info += `*Created:* ${new Date(groupMetadata.creation * 1000).toLocaleDateString()}\n`;
        info += `*Description:*\n${groupMetadata.desc || 'No description'}\n\n`;

        // Add participant stats
        const adminCount = groupMetadata.participants.filter(p => p.admin).length;
        info += `*👤 Participant Stats:*\n`;
        info += `• Admins: ${adminCount}\n`;
        info += `• Members: ${groupMetadata.participants.length - adminCount}`;

        // Try to get group profile picture
        let groupPicBuffer = null;
        try {
            const ppUrl = await message.client.profilePictureUrl(jid, 'image');
            if (ppUrl) {
                const response = await axios.get(ppUrl, { responseType: 'arraybuffer' });
                groupPicBuffer = Buffer.from(response.data, 'binary');
            }
        } catch (err) {
            // No group photo or error, ignore
        }

        // Send info to PM with or without photo
        if (groupPicBuffer) {
            await message.client.sendMessage(message.sender, {
                image: groupPicBuffer,
                caption: info
            });
        } else {
            await message.client.sendMessage(message.sender, {
                text: info + '\n\n*No group profile photo found.*'
            });
        }

        if (message.jid !== message.sender) {
            await message.sendReply('✅ Group info sent to your PM!');
        }

    } catch (error) {
        await message.sendReply(`*❌ Error:* Could not fetch group info\n${error}`);
    }
});