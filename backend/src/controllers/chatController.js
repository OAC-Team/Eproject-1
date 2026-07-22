const ChatSession = require('../models/chatSession');
const Groq = require('groq-sdk');
const { Chatbot } = require('../services/aiService');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const Painting = require('../models/painting.js');
const User = require('../models/user.js');

async function fetchRelevantContext(userMessage) {
    const msg = userMessage.toLowerCase();
    let context = '';

    if (msg.includes('painting') || msg.includes('art') || msg.includes('artwork') || msg.includes('gallery')) {
        const paintings = await Painting.find({ status: 'approved' })
            .select('title artist description tags artistic_style color_medium surface_type')
            .limit(20)
            .lean();

        if (paintings.length > 0) {
            context += `\nAvailable paintings in the gallery:\n`;
            paintings.forEach(p => {
                context += `- "${p.title}" by ${p.artist} | Style: ${p.artistic_style} | Medium: ${p.color_medium} | Tags: ${p.tags?.join(', ')}\n`;
            });
        }
    }

    const paintings = await Painting.find({ status: 'approved' }).lean();
    const mentionedPainting = paintings.find(p =>
        msg.includes(p.title?.toLowerCase())
    );

    if (mentionedPainting) {
        const mentionedPaintingUploader = await User.findById(mentionedPainting.user_id).lean()
        console.log(mentionedPaintingUploader)
        context += `\nThe user is asking about this specific painting:
        - Title: ${mentionedPainting.title}
        - Artist: ${mentionedPainting.artist}
        - Description: ${mentionedPainting.description}
        - Style: ${mentionedPainting.artistic_style}
        - Medium: ${mentionedPainting.color_medium}
        - Surface: ${mentionedPainting.surface_type}
        - Tags: ${mentionedPainting.tags?.join(', ')}
        - Uploader: ${mentionedPaintingUploader.username}\n`;
    }

    if (msg.includes('artist') || msg.includes('user') || msg.includes('who')) {
        const users = await User.find()
            .select('username bio')
            .limit(10)
            .lean();

        if (users.length > 0) {
            context += `\nArtists on the platform:\n`;
            users.forEach(u => {
                context += `- ${u.username}${u.bio ? `: ${u.bio}` : ''}\n`;
            });
        }
    }

    return context;
}

async function chat(req, res) {
    const { message, history, paintingContext, painting } = req.body;
    if (!message) return res.status(400).json({ message: 'No message provided.' });
    console.log(painting)
    try {
        const dbContext = await fetchRelevantContext(message);

        const bot = new Chatbot(history || []);

        const actualPainting = painting?.painting || painting;
        const uploader = painting?.uploader;

        let fullMessage = message;
        if (actualPainting || paintingContext || dbContext) {
            fullMessage = `[Platform Context: ${dbContext}]
            ${actualPainting ? `[Currently Viewed Painting:
            - Title: ${actualPainting.title}
            - Artist: ${uploader?.username || actualPainting.artist}
            - Style: ${actualPainting.artistic_style}
            - Medium: ${actualPainting.color_medium}
            - Surface: ${actualPainting.surface_type}
            - Tags: ${actualPainting.tags?.join(', ')}
            - Description: ${actualPainting.description}
            - Colors: ${actualPainting.colors?.map(c => c.name).join(', ')}]` : ''}
            
            User message: ${message}`;
        }
        // console.log("Painting object received:", JSON.stringify(painting, null, 2));
        // console.log("Full message sent to AI:", fullMessage);
        const reply = await bot.sendMessage(fullMessage);
        return res.status(200).json({ reply });
    } catch (error) {
        console.error("Chat error:", error);
        return res.status(500).json({ message: 'Chat failed.', error: error.message });
    }
}

module.exports = { chat }