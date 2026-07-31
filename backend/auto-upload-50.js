const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const connectDB = require('./src/config/db');
const Painting = require('./src/models/painting');
const User = require('./src/models/user');

const arts = [
    { title: "Whispers of the Wind", artist: "Evelyn Sterling" },
    { title: "Crimson Eclipse", artist: "Marcus Vance" },
    { title: "Serenade of Silence", artist: "Clara Dupont" },
    { title: "Golden Hour Symphony", artist: "Julian Mercer" },
    { title: "Ethereal Echoes", artist: "Sophia Thorne" },
    { title: "Nebula Dreams", artist: "Viktor Petrov" },
    { title: "Cascade of Colors", artist: "Amara Keita" },
    { title: "Solitude in Blue", artist: "Liam O'Connor" },
    { title: "Metropolis Rhythm", artist: "Elena Rossi" },
    { title: "Fragments of Time", artist: "Daisuke Tanaka" },
    { title: "Rustic Reverie", artist: "Hannah Abbott" },
    { title: "Oceanic Odyssey", artist: "Mateo Silva" },
    { title: "Celestial Garden", artist: "Zoe Zhang" },
    { title: "Shadows of the Past", artist: "Arthur Pendelton" },
    { title: "Prism of Hope", artist: "Aisha Rahman" },
    { title: "Enchanted Forest", artist: "Oliver Wood" },
    { title: "Urban Solitude", artist: "Sarah Jenkins" },
    { title: "Verdant Valley", artist: "Gabriel Martin" },
    { title: "Desert Mirage", artist: "Layla Al-Fayed" },
    { title: "Cosmic Dance", artist: "Neil Armstrong" },
    { title: "Reflections on Water", artist: "Claude Monet" },
    { title: "Sunflowers in Vase", artist: "Vincent van Gogh" },
    { title: "Geometric Harmony", artist: "Wassily Kandinsky" },
    { title: "The Last Horizon", artist: "William Turner" },
    { title: "Melody of Autumn", artist: "Leonid Afremov" },
    { title: "Silent Monologue", artist: "Edward Hopper" },
    { title: "Vibrant Chaos", artist: "Jackson Pollock" },
    { title: "Gilded Beauty", artist: "Gustav Klimt" },
    { title: "Sublime Nature", artist: "Caspar David Friedrich" },
    { title: "Mechanical Age", artist: "Fernand Léger" },
    { title: "Dream Landscape", artist: "Salvador Dalí" },
    { title: "Rustic Barn", artist: "Andrew Wyeth" },
    { title: "Still Life with Apples", artist: "Paul Cézanne" },
    { title: "Morning Mist", artist: "Albert Bierstadt" },
    { title: "Neon Nights", artist: "Syd Mead" },
    { title: "Sailing at Sunset", artist: "Winslow Homer" },
    { title: "Gothic Gateway", artist: "Albrecht Dürer" },
    { title: "The Blue Room", artist: "Pablo Picasso" },
    { title: "Golden Fields", artist: "Jean-François Millet" },
    { title: "Dancing Shadows", artist: "Edgar Degas" },
    { title: "Whispering Pines", artist: "Tom Thomson" },
    { title: "Starlight Pathway", artist: "Henri Martin" },
    { title: "Zen Garden", artist: "Sesshu Toyo" },
    { title: "Majestic Peaks", artist: "Thomas Moran" },
    { title: "Fading Light", artist: "John Singer Sargent" },
    { title: "Waves of Joy", artist: "Katsushika Hokusai" },
    { title: "Enigmatic Smile", artist: "Leonardo da Vinci" },
    { title: "Winter Solstice", artist: "Ivan Shishkin" },
    { title: "Flames of Passion", artist: "Edvard Munch" },
    { title: "Spring Awakening", artist: "Sandro Botticelli" }
];

const surfaces = ["Canvas", "Paper", "Wood", "Digital", "Glass", "Fabric", "Metal", "Ceramic", "Stone", "Wall", "Leather"];
const mediums = ["Oil", "Watercolor", "Acrylic", "Pixels", "Inks", "Charcoal", "Pastel", "Spray Paint", "Encaustic", "Pencils", "Mixed Media"];
const styles = ["Realism", "Abstract", "Impressionism", "Modern", "Surrealism", "Anime / Manga", "Pixel Art", "Concept Art", "Expressionism", "Art Nouveau", "Folk Art", "Dark Art"];

const seed50Paintings = async () => {
    try {
        console.log("Connecting to database...");
        await connectDB();

        // 1. Get an existing member or create a mock member user to associate with paintings
        let user = await User.findOne({ role: "user" });
        if (!user) {
            user = await User.findOne({}); // Get any user if no 'user' role
        }
        if (!user) {
            console.log("Creating temporary member user...");
            user = await User.create({
                username: "ArtLover",
                email: "artlover@example.com",
                password_hash: "$2b$10$abcdefghijklmnopqrstuv", // dummy
                role: "user",
                bio: "Art enthusiast uploading gorgeous high resolution paintings.",
                profile_picture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
            });
        }

        console.log(`Using User: ${user.username} (${user._id}) to seed paintings.`);

        // 2. Clear old approved paintings to avoid cluttering or just append?
        // Let's keep it safe: we will insert new ones.
        console.log("Generating 50 high-quality paintings with real image URLs...");

        const docs = [];
        for (let i = 0; i < 50; i++) {
            const artInfo = arts[i];
            const surface = surfaces[Math.floor(Math.random() * surfaces.length)];
            const medium = mediums[Math.floor(Math.random() * mediums.length)];
            const style = styles[Math.floor(Math.random() * styles.length)];

            // We use static high-quality Source Unsplash URLs with specific indexes so they show unique stunning pictures
            const imageId = 100 + i;
            const imageUrl = `https://picsum.photos/id/${imageId}/800/600`;

            docs.push({
                user_id: user._id,
                title: artInfo.title,
                artist: artInfo.artist,
                image_url: imageUrl,
                cloudinary_id: `auto_generated_picsum_${imageId}`,
                description: `A stunning and thought-provoking ${style.toLowerCase()} art piece, beautifully rendered with ${medium.toLowerCase()} on ${surface.toLowerCase()}. It invites viewers to explore the rich depths of its form, color palette, and emotional resonance.`,
                surface_type: surface,
                color_medium: medium,
                artistic_style: style,
                colors: [
                    { hex: "#3b82f6", name: "Sky Blue" },
                    { hex: "#1e293b", name: "Slate Dark" },
                    { hex: "#f59e0b", name: "Amber Gold" }
                ],
                tags: [style.toLowerCase(), medium.toLowerCase(), surface.toLowerCase(), "fineart", "gallery"],
                status: "approved",
                created_at: new Date(Date.now() - (50 - i) * 60 * 60 * 1000) // spread out creation times
            });
        }

        await Painting.insertMany(docs);
        console.log("Successfully uploaded 50 beautiful paintings to the gallery database!");
        process.exit(0);
    } catch (err) {
        console.error("Error seeding paintings:", err);
        process.exit(1);
    }
};

seed50Paintings();
