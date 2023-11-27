// hello.js

exports.handler = async (event, context) => {
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': 'http://localhost:3000', // Replace with your frontend's origin
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: "Hello, Netlify Function!" }),
    };
};