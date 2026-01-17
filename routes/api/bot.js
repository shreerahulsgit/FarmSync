const express = require('express');
const router = express.Router();
const axios = require('axios');
const user_data = require('../../models/user-data');
const message_data = require('../../models/message-data');

const generate_uid = (desired_length) => {
    const prefix = "01";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let random_part = Array.from({ length: desired_length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
    return prefix + random_part;
};

const GEMINI_API_KEY = "AIzaSyB6_jlc2PTenHETrpXCn5oLTarMxbOCBqQ";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

router.get('/api/history', async (req, res) => {
    try {
        const user_uid = req.session.uid;
        const user = await user_data.findOne({ uid: user_uid });

        const messages = await message_data.find({ channel: user.channel });

        res.json({ history: messages.map(msg => ({ uid: msg.uid, user: msg.user, content: msg.content, timestamp: msg.timestamp })) });
    } catch (error) {
        console.error('Error fetching chat history:', error);
        res.status(500).json({ error: 'Failed to fetch chat history' });
    }
});

router.post('/api/chat', async (req, res) => {
    try {
        const user = await user_data.findOne({ uid: req.session.uid });
        const { message } = req.body;
        
        if (!message) { return res.status(400).json({ error: 'Message is required' }); }
        const custom_uid = generate_uid(18)

        const new_message = new message_data({
            uid: custom_uid, user: user.uid, content: message, timestamp: new Date(), channel: user.channel
        });
        await new_message.save();
        
        const agriculture_context = `You are an AI assistant specializing in agriculture. 
            You provide helpful information about farming practices, crop management, soil health, 
            pest control, sustainable agriculture, and related topics. 
            Give practical advice that farmers can use.`;

        const context_messages = [{ role: 'user', parts: [{ text: message }]}];

        const geminiResponse = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            contents: context_messages,
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024
            }
        });
        
        const response_text = geminiResponse.data.candidates[0].content.parts[0].text;
        const message_uid = generate_uid(18)
        
        const bot_message = new message_data({
            uid: message_uid, user: 'bot', content: response_text, timestamp: new Date(), channel: user.channel
        });
        await bot_message.save();        
        
        res.json({ response: response_text, uid: message_uid });
    } catch (error) {
        console.error('Error sending message to Gemini API:', error);
        res.status(500).json({ error: 'Failed to process message' });
    }
});

module.exports = router;