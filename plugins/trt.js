const { Module } = require('../main');
const axios = require('axios');

Module({
    pattern: 'trt ?(.*)',
    fromMe: true, // Seuls les sudo/owner peuvent l'utiliser
    desc: 'Traduit un texte dans la langue souhaitée',
    usage: '.trt fr Hello world (ou en répondant à un message)',
    type: 'utility'
}, async (message, match) => {
    try {
        // 1. Extraction de la langue et du texte
        // Format attendu : .trt <code_langue> <texte>
        let lang = match[1] ? match[1].split(' ')[0].toLowerCase() : 'fr'; // 'fr' par défaut
        let text = match[1] ? match[1].replace(lang, '').trim() : '';

        // Si on répond à un message, on prend le texte du message cité
        if (message.reply_message && message.reply_message.text) {
            text = message.reply_message.text;
            // Si l'utilisateur a juste tapé ".trt en", on utilise 'en' comme langue
            if (match[1]) lang = match[1].trim().toLowerCase();
        }

        if (!text) {
            return await message.sendReply('_Veuillez fournir un texte ou répondre à un message._\n*Exemple:* `.trt en Bonjour`');
        }

        // 2. Appel à l'API de traduction (Google Translate Free API)
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`;
        
        const response = await axios.get(url);
        
        if (!response.data || !response.data[0]) {
            throw new Error('Traduction impossible');
        }

        // Reconstruction du texte traduit (pour les textes longs multi-lignes)
        const translation = response.data[0].map(item => item[0]).join('');
        const sourceLang = response.data[2]; // Détection auto de la langue source

        // 3. Mise en forme de la réponse
        const resultMessage = `*───「 TRADUCTION 」───*\n\n` +
                              `*De :* ${sourceLang.toUpperCase()}\n` +
                              `*Vers :* ${lang.toUpperCase()}\n\n` +
                              `*Résultat :*\n${translation}`;

        return await message.sendMessage(resultMessage, 'text', { quoted: message.data });

    } catch (error) {
        console.error('Erreur Plugin TRT :', error);
        return await message.sendReply('_Erreur lors de la traduction. Vérifiez le code de langue (ex: fr, en, es, ar)._');
    }
});