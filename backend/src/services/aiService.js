const Groq = require('groq-sdk');
const dotenv = require('dotenv');
const { image_vision_config, chatbot_config } = require('./ai_config.js')

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function sanitizeAiResponse(aiResult) {
    const validSurfaces = ["Canvas", "Paper", "Wood", "Digital", "Glass", "Fabric", "Metal", "Ceramic", "Stone", "Wall", "Leather"];
    const validMediums = ["Oil", "Watercolor", "Acrylic", "Pixels", "Inks", "Charcoal", "Pastel", "Spray Paint", "Encaustic", "Pencils", "Mixed Media"];
    const validStyles = ["Realism", "Abstract", "Impressionism", "Modern", "Surrealism", "Anime / Manga", "Pixel Art", "Concept Art", "Expressionism", "Art Nouveau", "Folk Art", "Dark Art"];

    const surface = validSurfaces.find(s => aiResult.surface_type?.toLowerCase().includes(s.toLowerCase())) || "Canvas";
    const medium = validMediums.find(m => aiResult.color_medium?.toLowerCase().includes(m.toLowerCase())) || "Oil";
    const style = validStyles.find(st => aiResult.artistic_style?.toLowerCase().includes(st.toLowerCase())) || "Modern";

    return {
        ...aiResult,
        surface_type: surface,
        color_medium: medium,
        artistic_style: style
    };
}
class ImageAnalyzer {
    constructor() {
        this.caption = "";
        this.tags = [];
        this.model = image_vision_config.model;
        this.title = "";
        this.surface_type = "";
        this.artistic_style = "";
        this.color_medium = "";
    }

    async analyzeImage(image_url) {
        const new_image_url = image_url.trim();

        try {
            const response = await groq.chat.completions.create({
                model: this.model,
                reasoning_effort: image_vision_config.reasoning_effort,
                messages: [
                    {
                        role: "user",
                        "content": [
                            {
                                "type": "text",
                                text: image_vision_config.prompt
                            },
                            {
                                "type": image_vision_config.content_type,
                                "image_url": {
                                    "url": new_image_url
                                }
                            }
                        ]
                    }
                ],
                "temperature": image_vision_config.temperature,
                "max_completion_tokens": image_vision_config.max_completion_tokens,
                "top_p": 1,
                "stream": false,
                "stop": null
            })
            let result = response.choices[0].message.content.trim();
            // console.log(result);
            // rawContent = rawContent.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
            // result = result.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
            let parsedData = JSON.parse(result);
            parsedData = sanitizeAiResponse(parsedData);
            this.caption = parsedData.caption;
            this.tags = parsedData.tags;
            this.title = parsedData.title;
            this.surface_type = parsedData.surface_type;
            this.artistic_style = parsedData.artistic_style;
            this.color_medium = parsedData.color_medium;
            return this;
        } catch (error) {
            console.error(error.message);
        }
    }

    getTags() {
        return this.tags;
    }

    getCaption() {
        return this.caption;
    }

    getTitle() {
        return this.title;
    }

    getSurfaceType() {
        return this.surface_type
    }

    getArtStyle() {
        return this.artistic_style
    }

    getColorMedium() {
        return this.color_medium
    }

    getAllInfo() {
        console.warn("getAllInfo() should only be used for debugging, not in production.");
        return this;
    }
}

class Chatbot {
    constructor(history = []) {
        this.history = history;
    }

    async sendMessage(userMessage) {
        const messagesPrompt = [
            { role: "system", content: "You are an AI Art Assistant for our digital gallery." + chatbot_config.prompt},
            ...this.history.map(m => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: m.text
            })),
            { role: "user", content: userMessage }
        ];

        const completion = await groq.chat.completions.create({
            model: chatbot_config.model,
            messages: messagesPrompt,
            reasoning_effort: chatbot_config.reasoning_effort
        });

        return completion.choices[0].message.content;
    }
}

class ImageInfoGenerator {
    static async generateArtworkSummary(title, tags, caption) {
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "user",
                    content: `Write a 3-sentence formal art summary for an artwork titled "${title}". Tags: ${tags.join(', ')}. Details: ${caption}`
                }
            ]
        });

        return completion.choices[0].message.content;
    }
}

module.exports = { ImageAnalyzer, Chatbot, ImageInfoGenerator }