'use strict';

const { Module } = require('../main');

const citations = [
    { text: "La vie est un mystère qu'il faut vivre, et non un problème à résoudre.", author: "Gandhi" },
    { text: "Le succès c'est d'aller d'échec en échec sans perdre son enthousiasme.", author: "Winston Churchill" },
    { text: "La seule façon de faire du bon travail est d'aimer ce que vous faites.", author: "Steve Jobs" },
    { text: "Soyez le changement que vous voulez voir dans le monde.", author: "Mahatma Gandhi" },
    { text: "La plus grande gloire n'est pas de ne jamais tomber, mais de se relever à chaque chute.", author: "Nelson Mandela" },
    { text: "Le bonheur n'est pas quelque chose de prêt à l'emploi. Il vient de vos propres actions.", author: "Dalaï-Lama" },
    { text: "Croyez en vous-même et tout sera possible.", author: "Chantal Kreviazuk" },
    { text: "La vie ne se mesure pas au nombre de respirations, mais aux moments qui nous coupent le souffle.", author: "Maya Angelou" },
    { text: "Le seul endroit où le succès vient avant le travail, c'est dans le dictionnaire.", author: "Vidal Sassoon" },
    { text: "Tout ce que l'esprit peut concevoir et croire, il peut l'accomplir.", author: "Napoleon Hill" },
    { text: "N'attendez pas. Le moment ne sera jamais parfait.", author: "Napoleon Hill" },
    { text: "Le courage c'est de savoir avoir peur et d'agir quand même.", author: "Nelson Mandela" },
    { text: "Votre temps est limité, ne le gâchez pas en vivant la vie de quelqu'un d'autre.", author: "Steve Jobs" },
    { text: "La persévérance est la mère du succès.", author: "Proverbe africain" },
    { text: "Un voyage de mille lieues commence toujours par un premier pas.", author: "Lao-Tseu" },
    { text: "Je pense donc je suis.", author: "René Descartes" },
    { text: "La connaissance parle, mais la sagesse écoute.", author: "Jimi Hendrix" },
    { text: "Le bonheur est réel seulement lorsqu'il est partagé.", author: "Jon Krakauer" },
    { text: "La vie est ce qui arrive quand vous êtes occupé à faire d'autres projets.", author: "John Lennon" },
    { text: "Ne jugez pas chaque jour par la récolte que vous faites, mais par les graines que vous plantez.", author: "Robert Louis Stevenson" },
    { text: "Il n'y a qu'une façon d'échouer, c'est d'abandonner avant d'avoir réussi.", author: "Olivier Lockert" },
    { text: "Le futur appartient à ceux qui croient à la beauté de leurs rêves.", author: "Eleanor Roosevelt" },
    { text: "On ne voit bien qu'avec le cœur. L'essentiel est invisible pour les yeux.", author: "Antoine de Saint-Exupéry" },
    { text: "La folie, c'est de faire toujours la même chose et de s'attendre à un résultat différent.", author: "Albert Einstein" },
    { text: "Ils ne savaient pas que c'était impossible, alors ils l'ont fait.", author: "Mark Twain" }
];

Module({
    pattern: 'quote',
    desc: 'Génère une citation inspirante et stylée avec son auteur',
    use: 'utilitaire',
    usage: 'quote'
}, async (message) => {
    try {
        await message.react('⏳');

        // Sélection aléatoire d'une citation
        const quoteObj = citations[Math.floor(Math.random() * citations.length)];

        // Design moderne et épuré
        const quoteCard = 
            `
             💬*« ${quoteObj.text} »*\n\n\n` +
            `✍️ *Auteur :* _${quoteObj.author}_`;

        await message.sendReply(quoteCard);
        await message.react('✨');

    } catch (e) {
        console.error("Erreur Plugin Quote:", e);
        await message.react('❌');
        await message.sendReply(`_Erreur :_ \`${e.message}\``);
    }
});