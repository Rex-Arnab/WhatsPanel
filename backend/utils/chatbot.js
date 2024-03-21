const { default: axios } = require("axios");
const { log } = require("loglevel");

const OPENAI_KEY = process.env.OPENAI_KEY;

async function askQuestion(question, prev = null) {
    console.log("Prompt doesn't exist. Asking AI...")
    const messages = prev ? [
        { role: 'assistant', content: prev },
        { role: 'user', content: question }
    ] : [
        { role: 'user', content: question }
    ]

    const aiRes = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_KEY}`,
        },
    }).catch((err) => {
        console.log(err);
    })
    try {
        console.log(aiRes.data);
    } catch (error) {
        console.log(aiRes.error);
    }

    return aiRes;
}

module.exports = {
    askQuestion,
}