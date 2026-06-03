const { Module } = require("../main");
const axios = require("axios");
const config = require("../config");
const fromMe = config.MODE == "public" ? false : true;
function sanitizeFilename(name) {
  if (!name) return "file";
  return name
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, "_")
    .slice(0, 180);
}

Module(
  {
    pattern: "apk ?(.*)",
    fromMe,
    desc: "Search APKs on apkpure. Reply with number to download",
    type: "downloader",
    use: "utility",
  },
  async (m, match) => {
    const query = match && match[1] ? match[1].trim() : "";
    if (!query)
      return await m.sendReply(
        "❌ _Provide a search query!_\n\nExample: `.apk WhatsApp`"
      );
    await m.sendReply(`_Searching apkpure for "${query}"_`);
    try {
      const res = await axios.get(
        "https://api.raganork.site/api/apkpure/search",
        {
          params: { query },
          timeout: 15000,
        }
      );
      const data = res.data;
      const results = data.results.slice(0, 10);
      if (!Array.isArray(results) || results.length === 0)
        return await m.sendReply("_No results found!_");
      let text = `APK results for "${query}"\n\n`;
      results.forEach((it, i) => {
        text += `${i + 1}. *_${it.title || it.name || "Unknown"}_*\n`;
        if (it.developer) text += `   by: *_${it.developer}_*\n`;
        if (it.version) text += `   Version: *_${it.version}_*\n`;
        if (it.size) text += `   Size: *_${it.size}_*\n`;
        if (it.desc) text += `   *_${it.desc}_*\n`;
        text += "\n";
      });
      text += `_Reply to this message with the number (1-${results.length}) to download the corresponding APK._`;
      await m.sendMessage(text, "text");
    } catch (err) {
      return await m.sendReply(
        "_Failed to search APKs. Please try again later._"
      );
    }
  }
);

Module(
  {
    on: "text",
    fromMe,
  },
  async (message) => {
    if (
      !message.reply_message ||
      message.reply_message.data.key.remoteJid !== message.jid
    )
      return;
    const origText =
      (message.reply_message.message &&
        message.reply_message.message.conversation) ||
      message.reply_message.text ||
      "";
    if (typeof origText !== "string") return;
    const qMatch = origText.match(/APK results for\s*"([^"\n]+)"/i);
    if (!qMatch) return;
    const query = qMatch[1].trim();
    const text = (message.message || "").trim();
    if (!/^\d+$/.test(text)) return;
    const selected = parseInt(text, 10);
    if (isNaN(selected) || selected < 1) {
      await message.edit(
        "❌ _Invalid selection. Reply with a valid number._",
        message.jid,
        message.reply_message.data.key
      );
      return false;
    }
    await message.edit(
      `⏳ _Fetching download link for ${selected}_`,
      message.jid,
      message.reply_message.data.key
    );
    let selectedText = "";
    try {
      const searchResp = await axios.get(
        "https://api.raganork.site/api/apkpure/search",
        { params: { query }, timeout: 15000 }
      );
      const sresults = searchResp.data.results;
      const chosen = sresults[selected - 1];
      if (!chosen) {
        await message.edit(
          "❌ _Selected item not found in fresh search._",
          message.jid,
          message.reply_message.data.key
        );
        return false;
      }
      const chosenLink = chosen.link;
      selectedText = chosen.title;
      let path = chosenLink;
      try {
        const u = new URL(chosenLink);
        path = u.pathname;
      } catch (e) {
        if (!path.startsWith("/")) path = `/${path}`;
      }

      const dlResp = await axios.get(
        "https://api.raganork.site/api/apkpure/download",
        {
          params: { path },
          timeout: 20000,
        }
      );
      const item = dlResp.data;
      let downloadUrl = item.url;

      if (!downloadUrl) {
        await message.edit(
          "❌ _Download link not found._",
          message.jid,
          message.reply_message.data.key
        );
        return false;
      }

      const isXapk = downloadUrl.includes("/XAPK/");
      const filenameBase = selectedText;
      const ext = isXapk ? ".xapk" : ".apk";
      const filename = `${sanitizeFilename(filenameBase)}_${(
        item.version || ""
      ).replace(/[^0-9A-Za-z_.-]/g, "")}${ext}`;
      const caption = isXapk
        ? "Note: Ce fichier est en format XAPK veuiller l'extraire."
        : "";
      await message.sendMessage({ url: downloadUrl }, "document", {
        fileName: filename,
        mimetype: "application/vnd.android.package-archive",
        quoted: message.data,
        caption,
      });
      await message.edit(
        `✅ _Sent: ${filename}_`,
        message.jid,
        message.reply_message.data.key
      );
    } catch (e) {
      await message.edit(
        "❌ _Failed to fetch download link._",
        message.jid,
        message.reply_message.data.key
      );
      return false;
    }
  }
);
