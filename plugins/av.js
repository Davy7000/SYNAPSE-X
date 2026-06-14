const { Module } = require('../main');

const truths = [
    "Quelle est la chose la plus embarrassante que tu aies faite devant ton crush ?",
    "As-tu déjà eu un crush sur quelqu'un dans ce groupe ?",
    "Quel est le mensonge le plus gros que tu aies dit à tes parents ?",
    "C'est quoi ton plus grand fantasme ?",
    "As-tu déjà envoyé un message au mauvais destinataire ? Que disait-il ?",
    "Quelle est la chose la plus folle que tu ferais pour impressionner quelqu'un ?",
    "Décris ton type idéal en 3 mots.",
    "As-tu déjà fait semblant d'aimer un cadeau ?",
    "Quel est ton plus grand regret amoureux ?",
    "As-tu déjà stalké le profil de quelqu'un toute une nuit ?",
    "Quelle est la chose la plus gênante dans ton historique de recherche ?",
    "As-tu déjà menti pour éviter un rendez-vous ?",
    "Si tu devais embrasser quelqu'un dans ce groupe, qui serait-ce ?",
    "Quel est ton pire moment de 'friendzone' ?",
    "As-tu déjà eu le cœur brisé ? Raconte.",
    "Quel est ton plus grand secret que personne ici ne connaît ? 🤐",
    "Qui est ton 'crush' secret ou ta célébrité préférée du moment ? 💘",
    "Quel est ton plus grand plaisir coupable (sexe entre amis....) ?",
    "Quelle est ta plus grande peur irrationnelle ? 👻",
    "Est tu en couple ou celibataire ?",
];

const dares = [
    "Envoie un message vocal en chantant les 5 prochaines secondes.",
    "Complimente un admin du groupe de façon exagérée.",
    "Envoie ton dernier selfie sans filtre dans le groupe.",
    "Écris un statut WhatsApp pendant 10 minutes : 'Je suis trop drôle 😎'",
    "Fais 10 pompes et envoie une vidéo preuve.",
    "Parle avec un accent pendant les 3 prochains tours.",
    "Envoie un message à la dernière personne avec qui tu as discuté : 'Tu me manques 😘' (envoi la capture pour preuve).",
    "Imite la voix d'un autre joueur pendant 30 secondes en vocal.",
    "Raconte une blague et si personne ne rit, tu refais une action.",
    "Change ta photo de profil pour quelque chose de ridicule pendant 1 heure.",
    "Danse pendant 15 secondes et envoie la vidéo.",
    "Fais un compliment sincère à chaque joueur, un par un.",
    "Parle uniquement en chuchotant pendant 2 tours.",
    "Envoie un emoji qui résume ta vie amoureuse actuelle.",
    "Raconte ton rêve le plus bizarre en détail.",
    "Parle uniquement en rimes jusqu'au prochain tour. 📜",
    "Imite le rire de quelqu'un du groupe jusqu'à ce qu'il se reconnaisse. 😂",
    "Fais une déclaration d'amour passionnée à un objet de la pièce (ex: une chaise ou une lampe). 🪑",
    "Chante le refrain de ta chanson préférée! 🎤",
    "imite le cri d'un poulet ! 🐔",
    "Wow tu as la possibilité de posé une question ou une action a la personne de ton choix",
];

const games = new Map();

Module({
    pattern: 'av ?(.*)',
    desc: 'Jouer à Action ou Vérité en groupe',
    use: 'Fun',
    usage: 'av start | join | <nom>'
}, async (message, match) => {
    if (!message.isGroup) return message.sendReply('_Ce jeu fonctionne uniquement dans un groupe._');

    const input = match[1] ? match[1].trim().toLowerCase() : '';
    const groupId = message.jid;

    if (input === 'start') {
        if (games.has(groupId)) return message.sendReply('_Une partie est déjà en cours dans ce groupe._');

        games.set(groupId, { players: [], started: false });

        await message.sendReply(
            `╭─〖 *A C T I O N  O U  V É R I T É* 〗─\n│\n│  🎮 _Pour participer, envoie ton prénom avec_\n│  \`.av <ton prénom>\`\n│\n│  ⏳ _Inscriptions ouvertes pendant 60 secondes_\n│  👥 _Min : 2 joueurs — Max : 6 joueurs_\n│\n╰─────────────────────`
        );

        setTimeout(async () => {
            const game = games.get(groupId);
            if (!game) return;

            if (game.players.length < 2) {
                games.delete(groupId);
                return message.sendReply('_Pas assez de joueurs (minimum 2). Partie annulée._');
            }

            game.started = true;
            game.currentIndex = 0;

            await message.sendReply(
                `╭───〖 *J O U E U R S* 〗───\n│\n${game.players.map((p, i) => `│  ${i + 1}. ${p.name}`).join('\n')}\n│\n╰─────────────────────\n\n_Le jeu commence ! Tape_ \`.av next\` _pour lancer le premier tour._`
            );
        }, 60000);

        return;
    }

    const game = games.get(groupId);

    if (input === 'next') {
        if (!game || !game.started) return message.sendReply('_Aucune partie en cours. Tape_ `.av start` _pour commencer._');

        const player = game.players[game.currentIndex % game.players.length];
        const isTruth = Math.random() < 0.5;
        const list = isTruth ? truths : dares;
        const item = list[Math.floor(Math.random() * list.length)];

        await message.sendReply(
            `╭───〖 *${isTruth ? '🗣️ VÉRITÉ' : '🔥 ACTION'}* 〗───\n│\n│  👤 *${player.name}*, à toi !\n│\n│  ${item}\n│\n╰─────────────────────\n\n_Tape_ \`.av next\` _pour le tour suivant._`
        );

        game.currentIndex++;
        return;
    }

    if (input === 'stop') {
        if (!games.has(groupId)) return message.sendReply('_Aucune partie en cours._');
        games.delete(groupId);
        return message.sendReply('_Partie terminée._');
    }

    if (!game || game.started) {
        return message.sendReply(
            `╭─〖 *A C T I O N  O U  V É R I T É* 〗─\n│\n│  \`.av start\` — _Démarrer une partie_\n│  \`.av <prénom>\` — _Rejoindre (pendant l'inscription)_\n│  \`.av next\` — _Tour suivant_\n│  \`.av stop\` — _Arrêter la partie_\n│\n╰─────────────────────`
        );
    }

    if (!input) return message.sendReply('_Précise ton prénom :_ `.av <prénom>`');

    if (game.players.length >= 6) return message.sendReply('_Le groupe de jeu est complet (6 joueurs max)._');

    if (game.players.some(p => p.jid === message.sender)) return message.sendReply('_Tu es déjà inscrit !_');

    game.players.push({ jid: message.sender, name: input });
    await message.sendReply(`_${input} a rejoint la partie !_ (${game.players.length}/6)`);
});