const { Module } = require('../main');

let quizSession = {}; 

// --- BASE DE DONNÉES DE 50+ QUESTIONS ---
const quizData = [
    { q: "Quelle est la capitale de l'Australie ?", a: "canberra" },
    { q: "Combien de cœurs possède une pieuvre ?", a: "3" },
    { q: "Quel est l'organe le plus lourd du corps humain ?", a: "foie" },
    { q: "En quelle année l'homme a-t-il marché sur la Lune ?", a: "1969" },
    { q: "Quel pays a remporté la Coupe du Monde 2022 ?", a: "argentine" },
    { q: "Quel est le plus long fleuve du monde ?", a: "nil" },
    { q: "Qui a écrit 'Les Misérables' ?", a: "victor hugo" },
    { q: "Quelle est la monnaie officielle du Japon ?", a: "yen" },
    { q: "Combien d'os y a-t-il dans le corps humain adulte ?", a: "206" },
    { q: "Quel gaz les plantes absorbent-elles ?", a: "co2" },
    { q: "Quel est le plus petit pays du monde ?", a: "vatican" },
    { q: "Qui a inventé l'ampoule électrique ?", a: "edison" },
    { q: "Dans quel pays se trouvent les pyramides de Gizeh ?", a: "egypte" },
    { q: "Quel est le métal le plus cher au monde ?", a: "rhodium" },
    { q: "Quelle est la capitale du Canada ?", a: "ottawa" },
    { q: "Quel est l'élément chimique représenté par la lettre O ?", a: "oxygene" },
    { q: "Quelle est la vitesse de la lumière (en km/s environ) ?", a: "300000" },
    { q: "Combien de dents possède un humain adulte ?", a: "32" },
    { q: "Quel animal est le plus rapide au monde ?", a: "guepard" },
    { q: "Dans quelle ville se trouve la Tour Eiffel ?", a: "paris" },
    { q: "Quel est le nom du fondateur de Microsoft ?", a: "bill gates" },
    { q: "Quelle est la capitale du Sénégal ?", a: "dakar" },
    { q: "Combien de couleurs y a-t-il dans l'arc-en-ciel ?", a: "7" },
    { q: "Quel est le plus grand désert du monde ?", a: "sahara" },
    { q: "Qui a sculpté la statue de la Liberté ?", a: "bartholdi" },
    { q: "Quel est le premier élément du tableau périodique ?", a: "hydrogene" },
    { q: "En quel mois fête-t-on Halloween ?", a: "octobre" },
    { q: "Quel est le pays du Soleil Levant ?", a: "japon" },
    { q: "Combien de minutes y a-t-il dans une journée ?", a: "1440" },
    { q: "Quelle est la capitale de l'Italie ?", a: "rome" },
    { q: "Quel est l'animal qui ne peut pas sauter ?", a: "elephant" },
    { q: "Qui est le dieu de la foudre dans la mythologie grecque ?", a: "zeus" },
    { q: "Quel est l'océan qui borde le Brésil ?", a: "atlantique" },
    { q: "Quelle est la langue la plus parlée au monde ?", a: "mandarin" },
    { q: "Combien de secondes y a-t-il dans une heure ?", a: "3600" },
    { q: "Quel est le plus grand mammifère marin ?", a: "baleine bleue" },
    { q: "Dans quelle galaxie vivons-nous ?", a: "voie lactee" },
    { q: "Qui est l'auteur de 'Harry Potter' ?", a: "jk rowling" },
    { q: "Quelle est la capitale du Maroc ?", a: "rabat" },
    { q: "Quel est le symbole chimique du fer ?", a: "fe" },
    { q: "Combien y a-t-il de joueurs dans une équipe de football ?", a: "11" },
    { q: "Quel est le plus grand sommet du monde ?", a: "everest" },
    { q: "Quelle est la capitale de l'Allemagne ?", a: "berlin" },
    { q: "Quel instrument de musique possède 88 touches ?", a: "piano" },
    { q: "Quel est le fruit préféré des singes ?", a: "banane" },
    { q: "Quel pays a inventé la pizza ?", a: "italie" },
    { q: "Qui était le premier président des USA ?", a: "george washington" },
    { q: "Quelle est la capitale de l'Espagne ?", a: "madrid" },
    { q: "Quel est le nom de la ville sainte de l'Islam ?", a: "la mecque" },
    { q: "Combien d'anneaux y a-t-il sur le drapeau olympique ?", a: "5" },
    { q: "Quelle planète est la plus proche du Soleil ?", a: "mercure" }
];

Module({
    pattern: 'jeu',
    fromMe: false,
    desc: 'Lance un quiz de 5 questions avec inscriptions',
    type: 'fun'
}, async (message) => {
    const jid = message.jid;
    if (quizSession[jid]) return await message.sendReply("_Un quiz est déjà en cours dans ce groupe._");

    quizSession[jid] = { state: 'joining', players: {}, currentQ: 0, answered: false };

    await message.client.sendMessage(jid, { 
        text: "🎮 *QUIZ CULTURE GÉNÉRALE* 🎮\n\nPréparez-vous ! Vous avez *15 secondes* pour participer.\n\nRépondez à ce message par *join* pour jouer !" 
    });

    setTimeout(async () => {
        const playersCount = Object.keys(quizSession[jid].players).length;
        if (playersCount < 1) {
            delete quizSession[jid];
            return await message.client.sendMessage(jid, { text: "❌ *Quiz annulé.* Aucun participant n'a été détecté." });
        }
        await message.client.sendMessage(jid, { text: `🚀 *C'est parti !* ${playersCount} joueurs sur la ligne de départ.` });
        startQuiz(message, jid);
    }, 15000);
});

// --- GESTION DES RÉPONSES ---
Module({
    on: 'text',
    fromMe: false,
    allow_group: true
}, async (message) => {
    const jid = message.jid;
    const session = quizSession[jid];
    if (!session) return;

    const text = message.text.toLowerCase().trim();

    // Inscription via "join"
    if (session.state === 'joining' && text === 'join') {
        if (!session.players[message.sender]) {
            session.players[message.sender] = { name: message.pushName || "Inconnu", score: 0 };
            await message.sendReply(`✅ @${message.sender.split('@')[0]} a rejoint la partie !`, { mentions: [message.sender] });
        }
    }

    // Capture de la réponse à la question
    if (session.state === 'playing' && !session.answered) {
        if (text === session.activeQuestion.a) {
            session.answered = true;
            session.players[message.sender].score += 1;
            await message.sendReply(`🌟 *BONNE RÉPONSE !* @${message.sender.split('@')[0]} marque 1 point.\n(Réponse : *${session.activeQuestion.a.toUpperCase()}*)`, { mentions: [message.sender] });
        }
    }
});

async function startQuiz(message, jid) {
    const session = quizSession[jid];
    
    // On mélange les questions à chaque fois pour l'aléatoire
    let shuffled = quizData.sort(() => 0.5 - Math.random());

    for (let i = 0; i < 5; i++) {
        session.state = 'playing';
        session.answered = false;
        session.activeQuestion = shuffled[i];

        await message.client.sendMessage(jid, { 
            text: `❓ *QUESTION ${i + 1}/5* :\n\n_${session.activeQuestion.q}_\n\n⏳ *30 secondes pour répondre !*` 
        });

        const startTime = Date.now();
        await new Promise(resolve => {
            const check = setInterval(() => {
                if (session.answered || (Date.now() - startTime) >= 30000) {
                    clearInterval(check);
                    resolve();
                }
            }, 500);
        });

        if (!session.answered) {
            await message.client.sendMessage(jid, { text: `⏰ *Temps écoulé !* La bonne réponse était : *${session.activeQuestion.a.toUpperCase()}*` });
        }
        await new Promise(res => setTimeout(res, 2500)); 
    }

   // --- RÉSULTATS FINAUX AVEC TAGS ---
    let result = "🏁 *FIN DU QUIZ SYNAPSE-X !* 🏁\n\n*CLASSEMENT FINAL :*\n";
    
    // On trie les joueurs par score
    const winners = Object.entries(session.players)
        .sort(([, a], [, b]) => b.score - a.score);

    // On prépare une liste pour stocker les JID à taguer
    let mentions = [];

    winners.forEach(([jid, p], idx) => {
        const icon = idx === 0 ? '🏆' : (idx === 1 ? '🥈' : (idx === 2 ? '🥉' : '👤'));
        
        // On ajoute le JID à la liste des mentions
        mentions.push(jid);
        
        // On construit la ligne avec le tag (@numéro)
        result += `${icon} @${jid.split('@')[0]} : *${p.score} points*\n`;
    });

    // On envoie le message final avec les mentions actives
    await message.client.sendMessage(jid, { 
        text: result, 
        mentions: mentions 
    });

    // On nettoie la session pour permettre un nouveau quiz
    delete quizSession[jid];
}