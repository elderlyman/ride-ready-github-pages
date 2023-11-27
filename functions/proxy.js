// functions/proxy.js

// Import the 'axios' library for making HTTP requests
const axios = require('axios');

// Define your serverless function
exports.handler = async function (event, context) {
    try {
        // Extract the URL from the query parameters
        const url = event.queryStringParameters.url;

        // Make the API request to the external domain
        const response = await axios.get(url);

        // Return the response from the external API
        return {
            statusCode: response.status,
            body: JSON.stringify(response.data),
        };
    } catch (error) {
        // Handle errors
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
