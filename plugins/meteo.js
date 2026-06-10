const { Module } = require('../main');
const config = require('../config');
const axios = require('axios');

const isPrivateBot = config.MODE !== 'public';

// Traduction française des codes météo Open-Meteo
const getWeatherDescription = (weatherCode) => {
    const descriptions = {
        0: 'Ciel dégagé',
        1: 'Principalement dégagé',
        2: 'Partiellement nuageux',
        3: 'Couvert',
        45: 'Brouillard',
        48: 'Brouillard givrant',
        51: 'Bruine légère',
        53: 'Bruine modérée',
        55: 'Bruine dense',
        61: 'Pluie faible',
        63: 'Pluie modérée',
        65: 'Pluie forte',
        80: 'Faibles averses de pluie',
        81: 'Averses de pluie modérées',
        82: 'Averses de pluie violentes',
        95: 'Orage',
        96: 'Orage avec grêle',
        99: 'Orage avec forte grêle'
    };
    return descriptions[weatherCode] || 'Inconnue';
};

const getWeatherEmoji = (weatherCode, isDay) => {
    const weatherCodes = {
        0: isDay ? '☀️' : '🌙',
        1: isDay ? '🌤️' : '🌙',
        2: '⛅',
        3: '☁️',
        45: '🌫️',
        48: '🌫️',
        51: '🌦️',
        53: '🌦️',
        55: '🌧️',
        61: '🌦️',
        63: '🌧️',
        65: '🌧️',
        80: '🌦️',
        81: '🌧️',
        82: '🌧️',
        95: '⛈️',
        96: '⛈️',
        99: '⛈️'
    };
    return weatherCodes[weatherCode] || '🌤️';
};

const getWindDirection = (deg) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(deg / 22.5) % 16];
};

// ==========================================
// COMMAND: .weather (Météo Actuelle)
// ==========================================
Module({
    pattern: 'weather ?(.*)',
    fromMe: isPrivateBot,
    desc: 'Obtenir les informations météo d’une ville',
    type: 'utility'
}, async (message, match) => {
    try {
        const city = match[1];
        
        if (!city) {
            return await message.sendReply('❌ *Veuillez indiquer le nom d\'une ville !*\n\n*Exemple :* .weather Brazzaville');
        }

        await message.sendReply('🔍 *Synapse-X récupère les données météo...*');

        // Étape 1 : Géocodage de la ville
        const geocodeResponse = await axios.get(`https://geocoding-api.open-meteo.com/v1/search`, {
            params: {
                name: city,
                count: 1,
                language: 'fr',
                format: 'json'
            }
        });

        if (!geocodeResponse.data.results || geocodeResponse.data.results.length === 0) {
            return await message.sendReply('❌ *Ville introuvable !* Vérifiez l\'orthographe et réessayez.');
        }

        const location = geocodeResponse.data.results[0];
        const { latitude, longitude, name, country } = location;

        // Étape 2 : Récupération des données météo en temps réel
        const weatherResponse = await axios.get(`https://api.open-meteo.com/v1/forecast`, {
            params: {
                latitude: latitude,
                longitude: longitude,
                current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m',
                daily: 'sunrise,sunset',
                timezone: 'auto',
                forecast_days: 1
            }
        });

        const current = weatherResponse.data.current;
        const daily = weatherResponse.data.daily;

        const temperature = Math.round(current.temperature_2m);
        const feelsLike = Math.round(current.apparent_temperature);
        const humidity = current.relative_humidity_2m;
        const pressure = Math.round(current.pressure_msl);
        const windSpeed = Math.round(current.wind_speed_10m);
        const windDirection = getWindDirection(current.wind_direction_10m);
        const cloudCover = current.cloud_cover;
        const weatherCode = current.weather_code;
        const isDay = current.is_day;
        const description = getWeatherDescription(weatherCode);
        const emoji = getWeatherEmoji(weatherCode, isDay);

        const sunrise = new Date(daily.sunrise[0]).toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit'
        });
        const sunset = new Date(daily.sunset[0]).toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit'
        });

        // Rendu textuel formaté
        let weatherInfo = `${emoji} *[ METEO : ${name.toUpperCase()}, ${country.toUpperCase()} ]*\n`;
        weatherInfo += '━━━━━━━━━━━━━━━━━━━━━━\n';
        weatherInfo += `🌡️ *Température :* ${temperature}°C (Ressenti : ${feelsLike}°C)\n`;
        weatherInfo += `☁️ *Condition :* ${description}\n`;
        weatherInfo += `💧 *Humidité :* ${humidity}%\n`;
        weatherInfo += `🔽 *Pression :* ${pressure} hPa\n`;
        weatherInfo += `💨 *Vent :* ${windSpeed} km/h (${windDirection})\n`;
        weatherInfo += `☁️ *Couverture nuageuse :* ${cloudCover}%\n`;
        weatherInfo += `🌅 *Lever du soleil :* ${sunrise}\n`;
        weatherInfo += `🌇 *Coucher du soleil :* ${sunset}\n`;
        weatherInfo += '━━━━━━━━━━━━━━━━━━━━━━\n\n';
        weatherInfo += '> *Propulsé par l\'OSS Company*\n';

        await message.sendReply(weatherInfo);

    } catch (error) {
        console.error('Erreur API Météo:', error);
        if (error.code === 'ENOTFOUND') {
            await message.sendReply('❌ *Erreur de connexion !* Impossible de joindre le serveur météo.');
        } else {
            await message.sendReply('❌ Une erreur est survenue lors de la récupération des données météo.');
        }
    }
});

// ==========================================
// COMMAND: .forecast (Prévisions 7 jours)
// ==========================================
Module({
    pattern: 'forecast ?(.*)',
    fromMe: isPrivateBot,
    desc: 'Obtenir les prévisions météo sur 7 jours',
    type: 'utility'
}, async (message, match) => {
    try {
        const city = match[1];
        
        if (!city) {
            return await message.sendReply('❌ *Veuillez indiquer le nom d\'une ville !*\n\n*Exemple :* .forecast Brazzaville');
        }

        await message.sendReply('🔍 *Synapse-X analyse les prévisions sur 7 jours...*');

        // Étape 1 : Géocodage de la ville
        const geocodeResponse = await axios.get(`https://geocoding-api.open-meteo.com/v1/search`, {
            params: {
                name: city,
                count: 1,
                language: 'fr',
                format: 'json'
            }
        });

        if (!geocodeResponse.data.results || geocodeResponse.data.results.length === 0) {
            return await message.sendReply('❌ *Ville introuvable !* Vérifiez l\'orthographe et réessayez.');
        }

        const location = geocodeResponse.data.results[0];
        const { latitude, longitude, name, country } = location;

        // Étape 2 : Récupération des prévisions hebdomadaires
        const forecastResponse = await axios.get(`https://api.open-meteo.com/v1/forecast`, {
            params: {
                latitude: latitude,
                longitude: longitude,
                daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max',
                timezone: 'auto',
                forecast_days: 7
            }
        });

        const daily = forecastResponse.data.daily;

        let forecastText = `📅 *[ PREVISIONS : ${name.toUpperCase()}, ${country.toUpperCase()} ]*\n`;
        forecastText += '━━━━━━━━━━━━━━━━━━━━━━\n\n';

        for (let i = 0; i < 7; i++) {
            const date = new Date(daily.time[i]);
            const dayName = date.toLocaleDateString('fr-FR', { weekday: 'short' });
            // Première lettre en majuscule pour le jour (ex: Lun., Mar.)
            const formattedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);
            const dateStr = date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' });
            
            const maxTemp = Math.round(daily.temperature_2m_max[i]);
            const minTemp = Math.round(daily.temperature_2m_min[i]);
            const weatherCode = daily.weather_code[i];
            const description = getWeatherDescription(weatherCode);
            const emoji = getWeatherEmoji(weatherCode, true); // True par défaut pour l'affichage de jour
            const precipitation = daily.precipitation_sum[i];
            const windSpeed = Math.round(daily.wind_speed_10m_max[i]);
            
            forecastText += `${emoji} *${formattedDay} ${dateStr}*\n`;
            forecastText += `    🌡️ ${maxTemp}°C / ${minTemp}°C • _${description}_`;
            if (precipitation > 0) {
                forecastText += ` • 🌧️ ${precipitation}mm`;
            }
            forecastText += `\n    💨 Vent : ${windSpeed} km/h\n\n`;
        }

        forecastText += '━━━━━━━━━━━━━━━━━━━━━━\n';
        forecastText += '> *Propulsé par l\'OSS Company*\n';

        await message.sendReply(forecastText);

    } catch (error) {
        console.error('Erreur API Prévisions:', error);
        await message.sendReply('❌ Une erreur est survenue lors de la récupération des prévisions hebdomadaires.');
    }
});