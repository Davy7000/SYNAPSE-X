const { Module } = require('../main');
const axios = require('axios');

let activeQuiz = new Set();

Module({
    pattern: 'question',
    fromMe: false,
    desc: 'Lance un quiz de culture générale en Français',
    type: 'game'
}, async (message, match) => {
    try {
        if (activeQuiz.has(message.jid)) {
            return await message.sendReply('_Un quiz est déjà en cours ici..._');
        }

        const res = await axios.get('https://opentdb.com/api.php?amount=1&type=multiple');
        if (!res.data || res.data.results.length === 0) return await message.sendReply('_Erreur de serveur._');

        const data = res.data.results[0];
        
        // --- SYSTÈME DE TRADUCTION AUTOMATIQUE ---
        const toTranslate = [data.question, data.correct_answer, ...data.incorrect_answers].join('|');
        const trtUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=fr&dt=t&q=${encodeURIComponent(toTranslate)}`;
        const trtRes = await axios.get(trtUrl);
        
        // On récupère et on sépare les éléments traduits
        const translatedArray = trtRes.data[0].map(item => item[0]).join('').split('|');
        
        const question = translatedArray[0].trim();
        const correctAnswer = translatedArray[1].trim();
        let options = translatedArray.slice(2).map(opt => opt.trim());

        // Mélange de la bonne réponse
        const randomIndex = Math.floor(Math.random() * (options.length + 1));
        options.splice(randomIndex, 0, correctAnswer);

        // Construction du message
        let quizMsg = `*╔═✪ QUIZ EN FRANÇAIS ✪═╗*\n\n`;
        quizMsg += `*❓ QUESTION :*\n_${question}_\n\n`;
        
        options.forEach((opt, i) => {
            quizMsg += `${i + 1}️⃣  ${opt}\n`;
        });

        quizMsg += `\n*⏱️ Temps :* 60 secondes\n*╚══════════════════╝*`;

        activeQuiz.add(message.jid);
        await message.client.sendMessage(message.jid, { text: quizMsg }, { quoted: message.data });

        setTimeout(async () => {
            activeQuiz.delete(message.jid);
            await message.client.sendMessage(message.jid, { 
                text: `*⌛ FIN DU TEMPS !*\n\n*La bonne réponse était :*\n✅ *${correctAnswer}*` 
            });
        }, 60000);

    } catch (error) {
        console.error('Quiz Error:', error);
        activeQuiz.delete(message.jid);
        return await message.sendReply('_Le service de quiz est saturé, réessaie dans un instant._');
    }
});