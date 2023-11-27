// seatgeekFunction.js
import fetch from 'node-fetch'
exports.handler = async (event, context) => {

    const eventLocation = event.queryStringParameters.eventLocation;
    const daysFromNow = event.queryStringParameters.daysFromNow;
    const client_id = event.queryStringParameters.client_id;

    try {

        const response = await fetch(
            `/.netlify/functions/proxy?url=https://api.seatgeek.com/2/events?client_id=${client_id}&venue.city=${eventLocation}&datetime_local.lte=${daysFromNow}&per_page=1000`
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
