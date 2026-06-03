const { Module } = require('../main');
const axios = require('axios');

// Stockage temporaire des quiz en cours pour éviter les doublons dans un même groupe
let activeQuiz = new Set();

Module({
    pattern: 'quiz',
    fromMe: false, // Ouvert à tout le monde
    desc: 'Lance un quiz de culture générale (60 secondes)',
    type: 'game'
}, async (message, match) => {
    try {
        if (activeQuiz.has(message.jid)) {
            return await message.sendReply('_Un quiz est déjà en cours dans ce groupe. Attendez la fin de celui-ci._');
        }

        // 1. Récupération de la question (API de culture générale)
        // Utilisation d'Open Trivia DB (en français via paramètre ou traduction simulée)
        const res = await axios.get('https://opentdb.com/api.php?amount=1&type=multiple');
        
        if (!res.data || res.data.results.length === 0) {
            return await message.sendReply('_Impossible de récupérer une question pour le moment._');
        }

        const data = res.data.results[0];
        const question = decodeHtml(data.question);
        const correctAnswer = decodeHtml(data.correct_answer);
        let options = data.incorrect_answers.map(ans => decodeHtml(ans));
        
        // Insérer la bonne réponse de manière aléatoire
        const randomIndex = Math.floor(Math.random() * (options.length + 1));
        options.splice(randomIndex, 0, correctAnswer);

        // 2. Préparation de l'affichage
        let quizMsg = `*╔══✪ QUIZ CULTURE ✪══╗*\n\n`;
        quizMsg += `*❓ QUESTION :*\n_${question}_\n\n`;
        
        options.forEach((opt, i) => {
            quizMsg += `${i + 1}️⃣  ${opt}\n`;
        });

        quizMsg += `\n*⏱️ Temps :* 60 secondes\n`;
        quizMsg += `*💡 Répondez avec le chiffre correspondant !*\n\n`;
        quizMsg += `*╚════════════════════╝*`;

        activeQuiz.add(message.jid);
        await message.client.sendMessage(message.jid, { text: quizMsg }, { quoted: message.data });

        // 3. Attente de 60 secondes
        setTimeout(async () => {
            activeQuiz.delete(message.jid);
            
            const finalMsg = `*⌛ TEMPS ÉCOULÉ !*\n\n*La bonne réponse était :*\n✅ *${correctAnswer}*\n\n_Merci d'avoir participé ! Tapez .quiz pour rejouer._`;
            
            await message.client.sendMessage(message.jid, { text: finalMsg });
        }, 60000); // 60 000 ms = 1 minute

    } catch (error) {
        console.error('Erreur Quiz:', error);
        activeQuiz.delete(message.jid);
        return await message.sendReply('_Erreur lors du lancement du quiz._');
    }
});

// Fonction pour nettoyer les caractères spéciaux HTML (ex: &quot; -> ")
function decodeHtml(html) {
    return html.replace(/&quot;/g, '"')
               .replace(/&#039;/g, "'")
               .replace(/&amp;/g, "&")
               .replace(/&lt;/g, "<")
               .replace(/&gt;/g, ">");
}