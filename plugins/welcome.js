const { Module } = require("../main");
const { ADMIN_ACCESS } = require("../config");
const { isAdmin, welcome, goodbye } = require("./utils");
const {
  parseWelcomeMessage,
  sendWelcomeMessage,
} = require("./utils/welcome-parser");

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎨 MODÈLES PAR DÉFAUT PRÉCONFIGURÉS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const DEFAULT_WELCOME = 
`🎉 *BIENVENUE DANS LE GROUPE !* 🎉

👤 *Membre :* $mention
🏰 *Groupe :* $group
👥 *Membres :* $count
📅 *Date d'arrivée :* $date à $time

📖 *Description du groupe :*
$desc

$pp`;

const DEFAULT_GOODBYE = 
`👋 *UN MEMBRE A QUITTÉ LE GROUPE* 👋

👤 *Membre :* $mention
🏰 *Groupe :* $group
👥 *Membres restants :* $count
📅 *Date de départ :* $date à $time

$pp`;

// Helper pour vérifier les permissions Admin/Owner
async function checkAdmin(message) {
  let adminAccess = ADMIN_ACCESS ? await isAdmin(message, message.sender) : false;
  if (!message.fromOwner && !adminAccess) {
    await message.sendReply("_❌ Cette commande est réservée aux administrateurs._");
    return false;
  }
  return true;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📥 COMMANDES WELCOME
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Module(
  {
    pattern: "welcome ?(.*)",
    fromMe: false,
    desc: "Active ou désactive les messages de bienvenue automatiques",
    usage: ".welcome on / .welcome off",
    use: "group",
  },
  async (message, match) => {
    if (!(await checkAdmin(message))) return;

    const input = match[1]?.trim().toLowerCase();

    // Saisie vide : afficher le statut actuel et l'aide
    if (!input) {
      const current = await welcome.get(message.jid);
      const isEnabled = current?.enabled ? "Activé ✅" : "Désactivé ❌";
      return await message.sendReply(
        `*⚙️ CONFIGURATION BIENVENUE*\n\n` +
        `*Statut actuel :* ${isEnabled}\n\n` +
        `*Commandes simples :*\n` +
        `• \`.welcome on\` : Activer le message automatique\n` +
        `• \`.welcome off\` : Désactiver le message\n` +
        `• \`.testwelcome\` : Tester le message dans le groupe`
      );
    }

    // Activation avec modèle par défaut
    if (input === "on") {
      const current = await welcome.get(message.jid);
      if (!current || !current.message) {
        await welcome.set(message.jid, DEFAULT_WELCOME);
      }
      await welcome.toggle(message.jid, true);
      return await message.sendReply("✅ *Message de bienvenue automatique activé !*");
    }

    // Désactivation
    if (input === "off") {
      await welcome.toggle(message.jid, false);
      return await message.sendReply("❌ *Message de bienvenue désactivé.*");
    }

    // Personnalisation optionnelle (si l'utilisateur écrit un texte personnalisé)
    const customMessage = match[1].trim();
    await welcome.set(message.jid, customMessage);
    await welcome.toggle(message.jid, true);
    return await message.sendReply("✅ *Nouveau message de bienvenue personnalisé enregistré et activé !*");
  }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📤 COMMANDES GOODBYE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Module(
  {
    pattern: "goodbye ?(.*)",
    fromMe: false,
    desc: "Active ou désactive les messages de départ automatiques",
    usage: ".goodbye on / .goodbye off",
    use: "group",
  },
  async (message, match) => {
    if (!(await checkAdmin(message))) return;

    const input = match[1]?.trim().toLowerCase();

    if (!input) {
      const current = await goodbye.get(message.jid);
      const isEnabled = current?.enabled ? "Activé ✅" : "Désactivé ❌";
      return await message.sendReply(
        `*⚙️ CONFIGURATION AU REVOIR*\n\n` +
        `*Statut actuel :* ${isEnabled}\n\n` +
        `*Commandes simples :*\n` +
        `• \`.goodbye on\` : Activer le message automatique\n` +
        `• \`.goodbye off\` : Désactiver le message\n` +
        `• \`.testgoodbye\` : Tester le message dans le groupe`
      );
    }

    if (input === "on") {
      const current = await goodbye.get(message.jid);
      if (!current || !current.message) {
        await goodbye.set(message.jid, DEFAULT_GOODBYE);
      }
      await goodbye.toggle(message.jid, true);
      return await message.sendReply("✅ *Message de départ automatique activé !*");
    }

    if (input === "off") {
      await goodbye.toggle(message.jid, false);
      return await message.sendReply("❌ *Message de départ désactivé.*");
    }

    const customMessage = match[1].trim();
    await goodbye.set(message.jid, customMessage);
    await goodbye.toggle(message.jid, true);
    return await message.sendReply("✅ *Nouveau message de départ personnalisé enregistré et activé !*");
  }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🧪 COMMANDES DE TEST
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Module(
  {
    pattern: "testwelcome",
    fromMe: false,
    desc: "Tester le message de bienvenue",
    use: "group",
  },
  async (message) => {
    if (!(await checkAdmin(message))) return;
    const data = await welcome.get(message.jid);
    const textToParse = data?.message || DEFAULT_WELCOME;
    const parsed = await parseWelcomeMessage(textToParse, message, [message.sender]);
    await sendWelcomeMessage(message, parsed);
  }
);

Module(
  {
    pattern: "testgoodbye",
    fromMe: false,
    desc: "Tester le message de départ",
    use: "group",
  },
  async (message) => {
    if (!(await checkAdmin(message))) return;
    const data = await goodbye.get(message.jid);
    const textToParse = data?.message || DEFAULT_GOODBYE;
    const parsed = await parseWelcomeMessage(textToParse, message, [message.sender]);
    await sendWelcomeMessage(message, parsed);
  }
);
