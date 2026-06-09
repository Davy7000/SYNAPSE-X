const { Module, commands } = require('../main');
const config = require('../config');
const fs = require('fs');

console.log("📂 [SYNAPSE-X] Plugin startup.js (Visuel) chargé avec succès !");

Module({
    on: "start",
    fromMe: false,
    desc: "Envoie un rapport système complet avec visuel au démarrage"
}, async (botContext) => {
    console.log("🚀 [SYNAPSE-X] Collecte des données et génération du rapport visuel...");

    try {
        const sock = botContext.client || botContext;
        const rawId = sock.user?.id || sock.user?.jid;
        
        if (!rawId) return;
        const myJid = rawId.split(':')[0] + '@s.whatsapp.net';

        // 1. Comptage des fichiers de plugins (.js)
        let totalFiles = 0;
        try {
            const files = fs.readdirSync(__dirname);
            totalFiles = files.filter(file => file.endsWith('.js')).length;
        } catch (e) {
            totalFiles = "Indéterminé";
        }

        // 2. Récupération des autres données
        const totalCommands = commands.length; 
        const currentHandler = config.HANDLERS === 'false' ? 'Aucun (Texte brut)' : config.HANDLERS;
        const botName = sock.user?.name || "Chers client";
        const botLang = (config.LANG || 'french').toUpperCase();
        const langFlag = botLang === 'FRENCH' ? '🇫🇷' : botLang === 'ENGLISH' ? '🇬🇧' : '🌐';
        //message et lien 
        const texte = ` ${botName} et merci d'avoir choisi SYNAPSE-X un bot multitâche et facile à déployer.`;
        // 3. Configuration du texte (qui servira de description à l'image)
        const bootMessage = `
╭──⧼ *SYNAPSE-X* ⧽──≽
│┃
│┃ ❏ *Statut :* _Opérationnel et prêt_
│┃ 
│┃ ❏ *Modules :* ${totalCommands} commandes
│┃ 
│┃ ❏ *Préfixe (Handler) :* ${currentHandler}
│┃
│┃ ❏ *Mode :* ${config.MODE || 'Privé'}
│┃ 
│┃ ❏ *plugins :* ${totalFiles} fichiers.js
│┃ 
│┃ ❏ *Language :* ${botLang} ${langFlag}
╰───────────── 
> Bienvenue ${texte}
`;

        // ─── LIEN DE TON IMAGE ICI (PNG ou JPG) ───
        // Tu peux héberger ton image en ligne et mettre son lien direct ici
        const imageUrl = 'https://files.catbox.moe/utb6rn.jpg'; 

        // 4. Envoi du package complet (Image + Texte)
        await sock.sendMessage(myJid, { 
            image: { url: imageUrl }, 
            caption: bootMessage 
        });

        console.log(`✅ [SYNAPSE-X] Rapport visuel envoyé avec succès.`);

    } catch (error) {
        console.error("❌ [SYNAPSE-X] Erreur lors de la génération du rapport visuel :", error);
    }
});