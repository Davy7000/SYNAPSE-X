const { Module } = require("../main");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const config = require("../config");

const isFromMe = config.MODE === "public" ? false : true;

Module(
{
    pattern: "identify ?(.*)",
    fromMe: isFromMe,
    desc: "Identify song from audio/video or URL",
    use: "misc"
},
async (message, match) => {

    const input = (match[1] || "").trim();
    let mediaUrl = "";
    let statusMsg;
    let filePath;

    try {

        if (input && /^https?:\/\//i.test(input)) {

            statusMsg = await message.sendReply("_🔍 Identifying song from URL..._");
            mediaUrl = input;

        } else if (
            message.reply_message &&
            (
                message.reply_message.audio ||
                message.reply_message.video ||
                message.reply_message.document
            )
        ) {

            statusMsg = await message.sendReply("_📤 Uploading media..._");

            filePath = await message.reply_message.download();

            const form = new FormData();
            form.append("file", fs.createReadStream(filePath));

            const upload = await axios.post(
                "https://cdnfile.pages.dev/temp",
                form,
                {
                    headers: form.getHeaders(),
                    timeout: 120000,
                    maxBodyLength: Infinity,
                    maxContentLength: Infinity
                }
            );

            if (
                !upload.data ||
                upload.data.status !== "success" ||
                !upload.data.url
            ) {
                throw new Error("Upload failed.");
            }

            mediaUrl = upload.data.url;

            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

            await message.edit(
                "_🎧 Identifying song..._",
                message.jid,
                statusMsg.key
            );

        } else if (
            message.reply_message &&
            message.reply_message.text &&
            /^https?:\/\//i.test(message.reply_message.text.trim())
        ) {

            statusMsg = await message.sendReply("_🔍 Identifying song from replied URL..._");
            mediaUrl = message.reply_message.text.trim();

        } else {

            return await message.sendReply(
`*_Reply to an audio/video/document or send:_*

*.identify https://cdnfile.pages.dev/car.mp4*`
            );

        }

        const { data } = await axios.get(
            "https://jerrycoder.oggyapi.workers.dev/tool/identify",
            {
                params: {
                    url: mediaUrl
                },
                timeout: 120000
            }
        );

        if (!data || data.status !== "success" || !(data.result || data).title) {
            throw new Error(data?.msg || "Song not found.");
        }

        const song = data.result || data;

        const caption =
`*🎵 Song Identified*

*Title :* ${song.title || "Unknown"}

*Artist :* ${song.artist || "Unknown"}

*Album :* ${song.Album || "Unknown"}

*Released :* ${song["Released on"] || "Unknown"}

*Duration :* ${song.Duration || "Unknown"}

*Label :* ${song.Label || "Unknown"}

*Genres :* ${song.Genres || "Unknown"}

*Shazam :*
${song.shazam_url}`;

        if (statusMsg) {
            await message.edit(
                "_✅ Song identified!_",
                message.jid,
                statusMsg.key
            );
        }

        if (song.image) {

            await message.sendMessage(
                { url: song.image },
                "image",
                { caption }
            );

        } else {

            await message.sendReply(caption);

        }

    } catch (err) {

        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        const error =
            err.response?.data?.msg ||
            err.response?.data?.error ||
            err.response?.data ||
            err.message;

        if (statusMsg) {

            await message.edit(
                `❌ _Failed to identify song._\n\n\`${error}\``,
                message.jid,
                statusMsg.key
            );

        } else {

            await message.sendReply(
                `❌ _Failed to identify song._\n\n\`${error}\``
            );

        }

    }

});