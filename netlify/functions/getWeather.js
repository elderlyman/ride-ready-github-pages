// getWeather.js
import fetch from 'node-fetch'
exports.handler = async (event, context) => {

    const weatherLocation = event.queryStringParameters.weatherLocation;
    const appid = event.queryStringParameters.appid;
    const exclude = event.queryStringParameters.exclude;
    const units = event.queryStringParameters.units;


    if (!weatherLocation || !exclude || !units || !appid) {
        throw new Error('Missing required parameters.');
    }

    try {
        const response = await fetch(
            `/.netlify/functions/proxy?url=https://api.openweathermap.org/data/2.5/onecall?${weatherLocation}&exclude=${exclude}&units=${units}&appid=${appid}`
        );

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(await response.json()),
        };
    } catch (error) {
        console.error('Error:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};
