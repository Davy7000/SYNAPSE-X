const { Module } = require('../main');
const axios = require('axios');

const FOOTBALL_API_KEY = 'b9bd96923587466e887c0efad5c7ba91';

const LEAGUES = {
    ligue1: { id: 2015, name: 'Ligue 1', emoji: ' 🇫🇷' },
    premier: { id: 2021, name: 'Premier League ', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    laliga: { id: 2014, name: 'La Liga', emoji: ' 🇪🇸' },
    seriea: { id: 2019, name: 'Serie A ', emoji: '🇮🇹' },
    bundesliga: { id: 2002, name: 'Bundesliga', emoji: ' 🇩🇪' }
};

async function getStandings(leagueId) {
    const res = await axios.get(`https://api.football-data.org/v4/competitions/${leagueId}/standings`, {
        headers: { 'X-Auth-Token': FOOTBALL_API_KEY },
        timeout: 10000
    });
    return res.data?.standings?.[0]?.table || [];
}

function formatStandings(table, league) {
    const rows = table.slice(0, 10).map((t, i) => {
        const pos = String(i + 1).padStart(2, ' ');
        const name = t.team.name.length > 14 ? t.team.name.slice(0, 14) + '.' : t.team.name.padEnd(15, ' ');
        const pts = String(t.points).padStart(3, ' ');
        const played = String(t.playedGames).padStart(2, ' ');
        const won = String(t.won).padStart(2, ' ');
        const draw = String(t.draw).padStart(2, ' ');
        const lost = String(t.lost).padStart(2, ' ');
        return `│  ${pos}. ${name} ${pts}pts  ${played}J ${won}G ${draw}N ${lost}P`;
    });

    return `╭───〖 *${league.name}${league.emoji}* 〗───
│
│  *#Équipe          Pts  J  G  N  P*
│  ────────────────────
${rows.join('\n')}
│
╰─────────────────────

> _Top 10 — Mis à jour en temps réel_ ⚽`;
}

Module({
    pattern: 'ligue1',
    fromMe: true,
    desc: 'Classement Ligue 1',
    use: 'sport',
    usage: 'ligue1'
}, async (message) => {
    try {
        await message.react('⏳');
        const table = await getStandings(LEAGUES.ligue1.id);
        await message.sendReply(formatStandings(table, LEAGUES.ligue1));
        await message.react('✅');
    } catch (e) {
        await message.react('❌');
        await message.sendReply(`_Erreur :_ \`${e.message}\``);
    }
});

Module({
    pattern: 'premier',
    fromMe: true,
    desc: 'Classement Premier League',
    use: 'sport',
    usage: 'premier'
}, async (message) => {
    try {
        await message.react('⏳');
        const table = await getStandings(LEAGUES.premier.id);
        await message.sendReply(formatStandings(table, LEAGUES.premier));
        await message.react('✅');
    } catch (e) {
        await message.react('❌');
        await message.sendReply(`_Erreur :_ \`${e.message}\``);
    }
});

Module({
    pattern: 'laliga',
    fromMe: true,
    desc: 'Classement La Liga',
    use: 'sport',
    usage: 'laliga'
}, async (message) => {
    try {
        await message.react('⏳');
        const table = await getStandings(LEAGUES.laliga.id);
        await message.sendReply(formatStandings(table, LEAGUES.laliga));
        await message.react('✅');
    } catch (e) {
        await message.react('❌');
        await message.sendReply(`_Erreur :_ \`${e.message}\``);
    }
});

Module({
    pattern: 'seriea',
    fromMe: true,
    desc: 'Classement Serie A',
    use: 'sport',
    usage: 'seriea'
}, async (message) => {
    try {
        await message.react('⏳');
        const table = await getStandings(LEAGUES.seriea.id);
        await message.sendReply(formatStandings(table, LEAGUES.seriea));
        await message.react('✅');
    } catch (e) {
        await message.react('❌');
        await message.sendReply(`_Erreur :_ \`${e.message}\``);
    }
});

Module({
    pattern: 'bundesliga',
    fromMe: true,
    desc: 'Classement Bundesliga',
    use: 'sport',
    usage: 'bundesliga'
}, async (message) => {
    try {
        await message.react('⏳');
        const table = await getStandings(LEAGUES.bundesliga.id);
        await message.sendReply(formatStandings(table, LEAGUES.bundesliga));
        await message.react('✅');
    } catch (e) {
        await message.react('❌');
        await message.sendReply(`_Erreur :_ \`${e.message}\``);
    }
});
Module({
    pattern: 'ucl',
    fromMe: true,
    desc: 'Classement Ligue des Champions',
    use: 'sport',
    usage: 'ucl'
}, async (message) => {
    try {
        await message.react('⏳');
        const table = await getStandings(2001);
        await message.sendReply(formatStandings(table, { name: 'UEFA Champions League 🇪🇺', emoji: '⭐' }));
        await message.react('✅');
    } catch (e) {
        await message.react('❌');
        await message.sendReply(`_Erreur :_ \`${e.message}\``);
    }
});
Module({
    pattern: 'cdm',
    fromMe: true,
    desc: 'Classement Coupe du Monde 2026',
    use: 'sport',
    usage: 'cdm'
}, async (message) => {
    try {
        await message.react('⏳');

        const { default: fetch } = await import('node-fetch');

        const res = await fetch('https://api.tavily.com/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                api_key: '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',
                query: 'FIFA World Cup 2026 group stage standings points table',
                search_depth: 'advanced',
                include_answer: true,
                max_results: 5
            })
        });

        const data = await res.json();

        if (!data.answer && !data.results?.length) {
            await message.react('❌');
            return message.sendReply('_Aucun classement disponible pour le moment._');
        }

        const answer = data.answer || data.results?.[0]?.content || 'Aucune donnée disponible.';
        const truncated = answer.length > 2000 ? answer.slice(0, 2000) + '...' : answer;

        const result = `╭───〖 *🌍 Coupe du Monde* 〗───
│
${truncated.split('\n').map(l => `│  ${l}`).join('\n')}
│
╰─────────────────────

> _utilisez trt fr pour la traduction_ ⚽`;

        await message.sendReply(result);
        await message.react('✅');

    } catch (e) {
        await message.react('❌');
        await message.sendReply(`_Erreur :_ \`${e.message}\``);
    }
});