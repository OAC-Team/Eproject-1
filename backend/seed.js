const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/user');
const Painting = require('./src/models/painting');

const seedData = async () => {
    try {
        const mongoUrl = process.env.MONGO_URL;
        if (!mongoUrl) {
            console.error("❌ Error: MONGO_URL is not defined in your .env file.");
            process.exit(1);
        }

        console.log("Connecting to database...");
        await mongoose.connect(mongoUrl);
        console.log("✅ MongoDB Connected!");

        // Clear existing users and paintings to prevent duplicates
        console.log("Cleaning database collections...");
        await User.deleteMany({});
        await Painting.deleteMany({});
        console.log("Database cleared!");

        // Hashing passwords
        const adminPasswordHash = await bcrypt.hash("adminpassword", 10);
        const memberPasswordHash = await bcrypt.hash("password123", 10);

        // Create Admin User
        console.log("Creating admin account...");
        const adminUser = await User.create({
            username: "admin",
            email: "admin@onlyart.com",
            password_hash: adminPasswordHash,
            role: "admin",
            bio: "Lead moderator and administrator of Only Art Collection.",
            profile_picture: "https://upload.wikimedia.org/wikipedia/commons/0/03/Twitter_default_profile_400x400.png"
        });

        // Create Member User
        console.log("Creating member account...");
        const memberUser = await User.create({
            username: "art_lover",
            email: "member@onlyart.com",
            password_hash: memberPasswordHash,
            role: "member",
            bio: "Digital art collector and traditional painter.",
            profile_picture: "https://upload.wikimedia.org/wikipedia/commons/0/03/Twitter_default_profile_400x400.png"
        });

        console.log("Accounts created successfully:");
        console.log(` - Admin Email: admin@onlyart.com | Password: adminpassword`);
        console.log(` - Member Email: member@onlyart.com | Password: password123`);

        // Create Painting documents
        console.log("Seeding painting collection with mock data...");
        const paintings = [
            {
                user_id: memberUser._id,
                title: "Starry Night Over the Rhone",
                artist: "Vincent van Gogh",
                image_url: "https://upload.wikimedia.org/wikipedia/commons/9/94/Starry_Night_Over_the_Rhone.jpg",
                cloudinary_id: "mock_cloudinary_rhone",
                description: "A famous landscape painting showing the Rhone River at night under a starry sky, showcasing Vincent van Gogh's expressive impasto technique.",
                surface_type: "canvas",
                color_medium: "oil",
                artistic_style: "impressionism",
                colors: [
                    { hex: "#0F2042", name: "Deep Cobalt Blue" },
                    { hex: "#D9A036", name: "Golden Amber" },
                    { hex: "#46729C", name: "Steel Blue" }
                ],
                tags: ["starry", "rhone", "night", "river", "impressionism"],
                status: "approved"
            },
            {
                user_id: memberUser._id,
                title: "Mona Lisa",
                artist: "Leonardo da Vinci",
                image_url: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
                cloudinary_id: "mock_cloudinary_monalisa",
                description: "The portrait of Lisa Gherardini, wife of Francesco del Giocondo, renowned for its soft sfumato technique and enigmatic expression.",
                surface_type: "wood",
                color_medium: "oil",
                artistic_style: "realism",
                colors: [
                    { hex: "#2A2720", name: "Charcoal Black" },
                    { hex: "#7E6E52", name: "Olive Drab" },
                    { hex: "#B89B72", name: "Warm Ochre" }
                ],
                tags: ["monalisa", "portrait", "da vinci", "masterpiece", "realism"],
                status: "approved"
            },
            {
                user_id: memberUser._id,
                title: "Water Lilies",
                artist: "Claude Monet",
                image_url: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Claude_Monet_-_Water_Lilies_-_Google_Art_Project_2.jpg",
                cloudinary_id: "mock_cloudinary_waterlilies",
                description: "A serene painting of Monet's flower garden in Giverny, showing pond reflections and gentle water lilies in loose watercolor style.",
                surface_type: "canvas",
                color_medium: "watercolor",
                artistic_style: "impressionism",
                colors: [
                    { hex: "#5C8D89", name: "Sage Green" },
                    { hex: "#748DA6", name: "Slate Blue" },
                    { hex: "#E4DCCF", name: "Parchment" }
                ],
                tags: ["waterlilies", "garden", "monet", "lake", "nature"],
                status: "approved"
            },
            {
                user_id: memberUser._id,
                title: "Composition VII",
                artist: "Wassily Kandinsky",
                image_url: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Vassily_Kandinsky_-_Composition_7.jpg",
                cloudinary_id: "mock_cloudinary_compositionvii",
                description: "A monumental work of abstract art, Composition VII displays an operatic explosion of colors, lines, and shapes in dynamic arrangement.",
                surface_type: "canvas",
                color_medium: "acrylic",
                artistic_style: "abstract",
                colors: [
                    { hex: "#C84B31", name: "Crimson Red" },
                    { hex: "#2D4263", name: "Indigo Blue" },
                    { hex: "#ECDBBA", name: "Sand Beige" }
                ],
                tags: ["abstract", "composition", "shapes", "modern", "explosion"],
                status: "approved"
            },
            {
                user_id: memberUser._id,
                title: "The Persistence of Memory",
                artist: "Salvador Dalí",
                image_url: "https://upload.wikimedia.org/wikipedia/en/d/dd/The_Persistence_of_Memory.jpg",
                cloudinary_id: "mock_cloudinary_persistence",
                description: "Surrealist masterpiece featuring melting clocks draped across a dreamlike landscape.",
                surface_type: "canvas",
                color_medium: "oil",
                artistic_style: "surrealism",
                colors: [
                    { hex: "#8B4513", name: "Saddle Brown" },
                    { hex: "#FFD700", name: "Gold" },
                    { hex: "#4169E1", name: "Royal Blue" }
                ],
                tags: ["surrealism", "memory", "clocks", "dreamscape", "dalí"],
                status: "approved"
            },
            {
                user_id: memberUser._id,
                title: "Girl with a Pearl Earring",
                artist: "Johannes Vermeer",
                image_url: "https://upload.wikimedia.org/wikipedia/commons/0/0f/1665_Girl_with_a_Pearl_Earring.jpg",
                cloudinary_id: "mock_cloudinary_pearlgirl",
                description: "Iconic portrait of a girl wearing an exotic dress and a large pearl earring against a dark background.",
                surface_type: "canvas",
                color_medium: "oil",
                artistic_style: "realism",
                colors: [
                    { hex: "#1F1F1F", name: "Black" },
                    { hex: "#FFD700", name: "Pearl White" },
                    { hex: "#4A90E2", name: "Cerulean" }
                ],
                tags: ["portrait", "vermeer", "pearl", "dutch", "classical"],
                status: "approved"
            },
            {
                user_id: memberUser._id,
                title: "The Great Wave",
                artist: "Katsushika Hokusai",
                image_url: "https://upload.wikimedia.org/wikipedia/commons/0/0a/The_Great_Wave_off_Kanagawa.jpg",
                cloudinary_id: "mock_cloudinary_wave",
                description: "Iconic woodblock print depicting a large wave threatening boats off the coast of Kanagawa.",
                surface_type: "paper",
                color_medium: "watercolor",
                artistic_style: "ukiyo-e",
                colors: [
                    { hex: "#1E3A8A", name: "Deep Blue" },
                    { hex: "#FFFFFF", name: "White" },
                    { hex: "#F59E0B", name: "Amber" }
                ],
                tags: ["wave", "hokusai", "japanese", "nature", "sea"],
                status: "approved"
            },
            {
                user_id: memberUser._id,
                title: "The Night Café",
                artist: "Vincent van Gogh",
                image_url: "https://upload.wikimedia.org/wikipedia/commons/6/67/Cafe_de_la_Place_Lamartine_-_The_Night_Café.jpg",
                cloudinary_id: "mock_cloudinary_nightcafe",
                description: "Dramatic interior scene of a café at night with vivid colors and emotional intensity.",
                surface_type: "canvas",
                color_medium: "oil",
                artistic_style: "post-impressionism",
                colors: [
                    { hex: "#DC2626", name: "Red" },
                    { hex: "#1F2937", name: "Dark Gray" },
                    { hex: "#FBBF24", name: "Yellow" }
                ],
                tags: ["cafe", "night", "interior", "van gogh", "emotional"],
                status: "approved"
            },
            {
                user_id: memberUser._id,
                title: "American Gothic",
                artist: "Grant Wood",
                image_url: "https://upload.wikimedia.org/wikipedia/commons/8/8c/Grant-Wood-American-Gothic.jpg",
                cloudinary_id: "mock_cloudinary_gothic",
                description: "Iconic painting depicting a farmer and his daughter standing before a farmhouse with a gothic roof.",
                surface_type: "beaverboard",
                color_medium: "oil",
                artistic_style: "realism",
                colors: [
                    { hex: "#3D2817", name: "Brown" },
                    { hex: "#E8E8E8", name: "Light Gray" },
                    { hex: "#2D5016", name: "Forest Green" }
                ],
                tags: ["american", "gothic", "rural", "symbolic", "portrait"],
                status: "approved"
            },
            {
                user_id: memberUser._id,
                title: "The Scream",
                artist: "Edvard Munch",
                image_url: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg",
                cloudinary_id: "mock_cloudinary_scream",
                description: "Expressionist masterpiece depicting an anguished figure against a tumultuous orange sky.",
                surface_type: "cardboard",
                color_medium: "oil",
                artistic_style: "expressionism",
                colors: [
                    { hex: "#FF6B35", name: "Orange Red" },
                    { hex: "#004E89", name: "Navy Blue" },
                    { hex: "#F7F7F7", name: "Off White" }
                ],
                tags: ["scream", "expressionism", "emotion", "anxiety", "munch"],
                status: "approved"
            },
            {
                user_id: memberUser._id,
                title: "Nighthawks",
                artist: "Edward Hopper",
                image_url: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Nighthawks_by_Edward_Hopper_1942.jpg",
                cloudinary_id: "mock_cloudinary_nighthawks",
                description: "Lonely urban scene of late-night diner with isolated figures bathed in artificial light.",
                surface_type: "canvas",
                color_medium: "oil",
                artistic_style: "realism",
                colors: [
                    { hex: "#2C3E50", name: "Dark Blue Gray" },
                    { hex: "#F39C12", name: "Orange" },
                    { hex: "#ECF0F1", name: "Light Gray" }
                ],
                tags: ["urban", "diner", "isolation", "american", "realism"],
                status: "approved"
            },
            {
                user_id: memberUser._id,
                title: "A Sunday Afternoon on the Island",
                artist: "Georges Seurat",
                image_url: "https://upload.wikimedia.org/wikipedia/commons/7/7d/A_Sunday_on_La_Grande_Jatte%2C_Georges_Seurat%2C_1884.jpg",
                cloudinary_id: "mock_cloudinary_sunday",
                description: "Pointillist masterpiece depicting leisurely Parisians on a riverside island.",
                surface_type: "canvas",
                color_medium: "oil",
                artistic_style: "pointillism",
                colors: [
                    { hex: "#7CB342", name: "Green" },
                    { hex: "#5D6D7B", name: "Gray Blue" },
                    { hex: "#FDD835", name: "Yellow" }
                ],
                tags: ["seurat", "pointillism", "park", "leisure", "french"],
                status: "approved"
            },
            {
                user_id: memberUser._id,
                title: "Christina's World",
                artist: "Andrew Wyeth",
                image_url: "https://upload.wikimedia.org/wikipedia/en/7/7d/Christinas_World_Andrew_Wyeth.jpg",
                cloudinary_id: "mock_cloudinary_christina",
                description: "Mysterious scene of a woman crawling through a field toward a farmhouse in the distance.",
                surface_type: "masonite",
                color_medium: "tempera",
                artistic_style: "realism",
                colors: [
                    { hex: "#8B7355", name: "Tan" },
                    { hex: "#6B4423", name: "Brown" },
                    { hex: "#D2691E", name: "Chocolate" }
                ],
                tags: ["wyeth", "field", "rural", "mysterious", "landscape"],
                status: "approved"
            },
            {
                user_id: memberUser._id,
                title: "The Birth of Venus",
                artist: "Sandro Botticelli",
                image_url: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Sandro_Botticelli_-_La_Nascita_di_Venere.jpg",
                cloudinary_id: "mock_cloudinary_venus",
                description: "Renaissance masterpiece depicting the goddess Venus emerging from the sea on a shell.",
                surface_type: "canvas",
                color_medium: "oil",
                artistic_style: "renaissance",
                colors: [
                    { hex: "#87CEEB", name: "Sky Blue" },
                    { hex: "#FFB6C1", name: "Light Pink" },
                    { hex: "#DEB887", name: "Burlywood" }
                ],
                tags: ["venus", "renaissance", "mythology", "botticelli", "classical"],
                status: "approved"
            },
            {
                user_id: memberUser._id,
                title: "The Son of Man",
                artist: "René Magritte",
                image_url: "https://upload.wikimedia.org/wikipedia/en/d/d0/The_Son_of_Man.jpg",
                cloudinary_id: "mock_cloudinary_sonofman",
                description: "Surrealist portrait of a man in a bowler hat with an apple floating before his face.",
                surface_type: "canvas",
                color_medium: "oil",
                artistic_style: "surrealism",
                colors: [
                    { hex: "#36454F", name: "Charcoal" },
                    { hex: "#E6E6FA", name: "Lavender" },
                    { hex: "#DC143C", name: "Crimson" }
                ],
                tags: ["magritte", "surrealism", "portrait", "mystery", "bowler"],
                status: "approved"
            },
            {
                user_id: memberUser._id,
                title: "Wanderer Above the Sea of Fog",
                artist: "Caspar David Friedrich",
                image_url: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Caspar_David_Friedrich_-_Wanderer_Above_the_Sea_of_Fog.jpg",
                cloudinary_id: "mock_cloudinary_wanderer",
                description: "Romantic landscape of a lone figure standing before a misty mountain landscape.",
                surface_type: "canvas",
                color_medium: "oil",
                artistic_style: "romanticism",
                colors: [
                    { hex: "#4A5859", name: "Dark Gray Blue" },
                    { hex: "#A9A9A9", name: "Gray" },
                    { hex: "#696969", name: "Dim Gray" }
                ],
                tags: ["friedrich", "romantic", "mountain", "fog", "solitude"],
                status: "approved"
            },
            {
                user_id: memberUser._id,
                title: "The Raft of the Medusa",
                artist: "Théodore Géricault",
                image_url: "https://upload.wikimedia.org/wikipedia/commons/9/92/Le_Radeau_de_la_M%C3%A9duse.jpg",
                cloudinary_id: "mock_cloudinary_raft",
                description: "Dramatic history painting depicting survivors of a shipwreck on a makeshift raft.",
                surface_type: "canvas",
                color_medium: "oil",
                artistic_style: "romanticism",
                colors: [
                    { hex: "#1A1A1A", name: "Black" },
                    { hex: "#8B0000", name: "Dark Red" },
                    { hex: "#D3D3D3", name: "Light Gray" }
                ],
                tags: ["géricault", "shipwreck", "drama", "romantic", "historical"],
                status: "approved"
            },
            {
                user_id: memberUser._id,
                title: "The Third of May 1808",
                artist: "Francisco Goya",
                image_url: "https://upload.wikimedia.org/wikipedia/commons/f/fc/Goya%2C_Third_of_May_1808.jpg",
                cloudinary_id: "mock_cloudinary_thirdmay",
                description: "Powerful anti-war painting depicting the execution of Spanish civilians by Napoleon's soldiers.",
                surface_type: "canvas",
                color_medium: "oil",
                artistic_style: "romanticism",
                colors: [
                    { hex: "#1F1F1F", name: "Black" },
                    { hex: "#FFFFFF", name: "White" },
                    { hex: "#FF6347", name: "Red" }
                ],
                tags: ["goya", "execution", "war", "political", "dramatic"],
                status: "approved"
            },
            {
                user_id: memberUser._id,
                title: "Nighttime Cafe",
                artist: "Vincent van Gogh",
                image_url: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Cafe_de_la_gare_at_place_Lamartine.jpg",
                cloudinary_id: "mock_cloudinary_nightcafe2",
                description: "Another evocative cafe scene with warm golden light and cool shadows.",
                surface_type: "canvas",
                color_medium: "oil",
                artistic_style: "post-impressionism",
                colors: [
                    { hex: "#2A2A2A", name: "Dark Gray" },
                    { hex: "#F4D03F", name: "Golden Yellow" },
                    { hex: "#6B5B95", name: "Purple" }
                ],
                tags: ["cafe", "van gogh", "light", "nighttime", "atmospheric"],
                status: "approved"
            },
            {
                user_id: memberUser._id,
                title: "The Kiss",
                artist: "Gustav Klimt",
                image_url: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Gustav_Klimt_016.jpg",
                cloudinary_id: "mock_cloudinary_kiss",
                description: "Iconic art nouveau masterpiece celebrating intimate love with ornate golden patterns.",
                surface_type: "canvas",
                color_medium: "oil",
                artistic_style: "art nouveau",
                colors: [
                    { hex: "#FFD700", name: "Gold" },
                    { hex: "#DC143C", name: "Crimson Red" },
                    { hex: "#2F4F4F", name: "Dark Slate Gray" }
                ],
                tags: ["klimt", "kiss", "love", "gold", "art nouveau"],
                status: "approved"
            },
            {
                user_id: memberUser._id,
                title: "Irises",
                artist: "Vincent van Gogh",
                image_url: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Van_Gogh_-_Irises.jpg",
                cloudinary_id: "mock_cloudinary_irises",
                description: "Vibrant study of purple irises in a vase with bold, expressive brushstrokes.",
                surface_type: "canvas",
                color_medium: "oil",
                artistic_style: "post-impressionism",
                colors: [
                    { hex: "#663399", name: "Purple" },
                    { hex: "#FFD700", name: "Gold" },
                    { hex: "#228B22", name: "Forest Green" }
                ],
                tags: ["irises", "flowers", "van gogh", "purple", "nature"],
                status: "approved"
            },
            {
                user_id: memberUser._id,
                title: "The Son of Man",
                artist: "Salvador Dalí",
                image_url: "https://upload.wikimedia.org/wikipedia/en/c/ca/The_Son_of_Man_%28painting%29.jpg",
                cloudinary_id: "mock_cloudinary_sonofman2",
                description: "Intriguing surrealist portrait of a man with his face obscured by a green apple.",
                surface_type: "canvas",
                color_medium: "oil",
                artistic_style: "surrealism",
                colors: [
                    { hex: "#4A4A4A", name: "Dark Gray" },
                    { hex: "#E8E8E8", name: "Light Gray" },
                    { hex: "#228B22", name: "Green" }
                ],
                tags: ["dalí", "surrealism", "portrait", "mystery", "conceptual"],
                status: "approved"
            },
            {
                user_id: memberUser._id,
                title: "The Wounded Deer",
                artist: "Frida Kahlo",
                image_url: "https://upload.wikimedia.org/wikipedia/en/0/0f/The_Wounded_Deer_%281946%29.jpg",
                cloudinary_id: "mock_cloudinary_deerwounded",
                description: "Surreal self-portrait where Frida's face is set upon a wounded deer's body.",
                surface_type: "masonite",
                color_medium: "oil",
                artistic_style: "surrealism",
                colors: [
                    { hex: "#8B4513", name: "Saddle Brown" },
                    { hex: "#DC143C", name: "Crimson" },
                    { hex: "#2F4F4F", name: "Dark Slate" }
                ],
                tags: ["kahlo", "surrealism", "self-portrait", "pain", "nature"],
                status: "approved"
            },
            {
                user_id: memberUser._id,
                title: "Two Fridas",
                artist: "Frida Kahlo",
                image_url: "https://upload.wikimedia.org/wikipedia/en/0/0f/Las_dos_Fridas.jpg",
                cloudinary_id: "mock_cloudinary_twofridas",
                description: "Powerful double self-portrait showing two versions of Frida holding hands.",
                surface_type: "masonite",
                color_medium: "oil",
                artistic_style: "surrealism",
                colors: [
                    { hex: "#DC143C", name: "Red" },
                    { hex: "#FFFFFF", name: "White" },
                    { hex: "#4A4A4A", name: "Gray" }
                ],
                tags: ["kahlo", "self-portrait", "identity", "love", "surrealism"],
                status: "approved"
            },
            {
                user_id: memberUser._id,
                title: "Japanese Bridge",
                artist: "Claude Monet",
                image_url: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Monet_-_The_Japanese_Bridge_-_1899%2C_Ryerson.jpg",
                cloudinary_id: "mock_cloudinary_bridge",
                description: "Serene garden scene featuring a curved Japanese bridge over a lily pond.",
                surface_type: "canvas",
                color_medium: "oil",
                artistic_style: "impressionism",
                colors: [
                    { hex: "#5A7C59", name: "Sage Green" },
                    { hex: "#8B7355", name: "Tan Brown" },
                    { hex: "#A0826D", name: "Rose Tan" }
                ],
                tags: ["monet", "garden", "bridge", "japanese", "water"],
                status: "approved"
            },
            {
                user_id: memberUser._id,
                title: "Rouen Cathedral",
                artist: "Claude Monet",
                image_url: "https://upload.wikimedia.org/wikipedia/commons/3/38/Claude_Monet_-_Rouen_Cathedral_Facade_-_Google_Art_Project.jpg",
                cloudinary_id: "mock_cloudinary_rouen",
                description: "Series painting of the Rouen Cathedral facade in different light conditions.",
                surface_type: "canvas",
                color_medium: "oil",
                artistic_style: "impressionism",
                colors: [
                    { hex: "#B8860B", name: "Dark Goldenrod" },
                    { hex: "#DEB887", name: "Burlywood" },
                    { hex: "#CD853F", name: "Peru" }
                ],
                tags: ["monet", "cathedral", "architecture", "light", "series"],
                status: "approved"
            },
            {
                user_id: memberUser._id,
                title: "Sunflowers",
                artist: "Vincent van Gogh",
                image_url: "https://upload.wikimedia.org/wikipedia/commons/4/43/Sunflowers_by_Vincent_Van_Gogh.jpg",
                cloudinary_id: "mock_cloudinary_sunflowers",
                description: "Iconic still life of vibrant sunflowers in a vase with bold yellows and blues.",
                surface_type: "canvas",
                color_medium: "oil",
                artistic_style: "post-impressionism",
                colors: [
                    { hex: "#FFD700", name: "Gold" },
                    { hex: "#FF8C00", name: "Dark Orange" },
                    { hex: "#4169E1", name: "Royal Blue" }
                ],
                tags: ["van gogh", "sunflowers", "still life", "yellow", "flowers"],
                status: "approved"
            },
            {
                user_id: memberUser._id,
                title: "Cafe Terrace at Night",
                artist: "Vincent van Gogh",
                image_url: "https://upload.wikimedia.org/wikipedia/commons/3/30/VanGogh-CafeTerrace.jpg",
                cloudinary_id: "mock_cloudinary_cafeterrace",
                description: "Warm, inviting scene of an outdoor cafe at night with starlit sky above.",
                surface_type: "canvas",
                color_medium: "oil",
                artistic_style: "post-impressionism",
                colors: [
                    { hex: "#FBBF24", name: "Amber Yellow" },
                    { hex: "#1E3A8A", name: "Deep Blue" },
                    { hex: "#9333EA", name: "Purple" }
                ],
                tags: ["van gogh", "cafe", "night", "stars", "atmospheric"],
                status: "approved"
            },
            {
                user_id: memberUser._id,
                title: "Rain at Étretat",
                artist: "Claude Monet",
                image_url: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Claude_Monet_-_Étretat_in_the_rain%2C_1886%2C_oil_on_canvas.jpg",
                cloudinary_id: "mock_cloudinary_rain",
                description: "Dramatic seascape with rocky cliffs and rough seas under stormy weather.",
                surface_type: "canvas",
                color_medium: "oil",
                artistic_style: "impressionism",
                colors: [
                    { hex: "#2F4F4F", name: "Dark Slate Gray" },
                    { hex: "#708090", name: "Slate Gray" },
                    { hex: "#B0C4DE", name: "Light Steel Blue" }
                ],
                tags: ["monet", "sea", "rain", "nature", "dramatic"],
                status: "approved"
            },
            {
                user_id: memberUser._id,
                title: "The Death of Marat",
                artist: "Jacques-Louis David",
                image_url: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Death_of_Marat_by_Jacques-Louis_David_1793.jpg",
                cloudinary_id: "mock_cloudinary_marat",
                description: "Political history painting depicting the death of the French revolutionary Jean-Paul Marat.",
                surface_type: "canvas",
                color_medium: "oil",
                artistic_style: "neoclassicism",
                colors: [
                    { hex: "#1F1F1F", name: "Black" },
                    { hex: "#FFFFFF", name: "White" },
                    { hex: "#8B0000", name: "Dark Red" }
                ],
                tags: ["david", "neoclassic", "history", "political", "revolutionary"],
                status: "approved"
            },
            {
                user_id: memberUser._id,
                title: "Liberty Leading the People",
                artist: "Eugène Delacroix",
                image_url: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Eugène_Delacroix_-_La_liberté_guidant_le_peuple.jpg",
                cloudinary_id: "mock_cloudinary_liberty",
                description: "Iconic history painting of Liberty guiding the people during revolution with national flag.",
                surface_type: "canvas",
                color_medium: "oil",
                artistic_style: "romanticism",
                colors: [
                    { hex: "#0066CC", name: "Blue" },
                    { hex: "#FFFFFF", name: "White" },
                    { hex: "#CC0000", name: "Red" }
                ],
                tags: ["delacroix", "liberty", "revolution", "france", "freedom"],
                status: "approved"
            },
            {
                user_id: memberUser._id,
                title: "The Hay Wain",
                artist: "John Constable",
                image_url: "https://upload.wikimedia.org/wikipedia/commons/0/05/The_Hay_Wain.jpg",
                cloudinary_id: "mock_cloudinary_hay",
                description: "Romantic landscape of a rural hay wagon crossing a river in the English countryside.",
                surface_type: "canvas",
                color_medium: "oil",
                artistic_style: "romanticism",
                colors: [
                    { hex: "#228B22", name: "Forest Green" },
                    { hex: "#87CEEB", name: "Sky Blue" },
                    { hex: "#8B7355", name: "Tan" }
                ],
                tags: ["constable", "landscape", "rural", "english", "nature"],
                status: "approved"
            },
            {
                user_id: memberUser._id,
                title: "Snow Storm",
                artist: "J.M.W. Turner",
                image_url: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Turner%2C_Snowstorm_-_Steam-Boat_off_a_Harbour%27s_Mouth%2C_1842.jpg",
                cloudinary_id: "mock_cloudinary_snowstorm",
                description: "Turbulent seascape depicting a steam boat in a violent snowstorm at sea.",
                surface_type: "canvas",
                color_medium: "oil",
                artistic_style: "romanticism",
                colors: [
                    { hex: "#4A4A4A", name: "Dark Gray" },
                    { hex: "#FFFFFF", name: "White" },
                    { hex: "#FFB6C1", name: "Light Pink" }
                ],
                tags: ["turner", "storm", "sea", "dramatic", "nature"],
                status: "approved"
            },
            {
                user_id: memberUser._id,
                title: "Saturn Devouring his Son",
                artist: "Francisco Goya",
                image_url: "https://upload.wikimedia.org/wikipedia/commons/d/da/Francisco_Goya_-_Saturn_Devouring_His_Son_%281823%29.jpg",
                cloudinary_id: "mock_cloudinary_saturn",
                description: "Dark and disturbing black painting depicting the mythological figure Saturn consuming his child.",
                surface_type: "wall",
                color_medium: "oil",
                artistic_style: "dark romanticism",
                colors: [
                    { hex: "#1A1A1A", name: "Black" },
                    { hex: "#8B0000", name: "Dark Red" },
                    { hex: "#696969", name: "Dim Gray" }
                ],
                tags: ["goya", "mythology", "dark", "disturbing", "expressionist"],
                status: "approved"
            },
            {
                user_id: memberUser._id,
                title: "A Wheatfield with Cypresses",
                artist: "Vincent van Gogh",
                image_url: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Vincent_van_Gogh_-_A_Wheatfield_with_Cypresses.jpg",
                cloudinary_id: "mock_cloudinary_wheat",
                description: "Serene landscape combining golden wheat fields with tall dark cypress trees.",
                surface_type: "canvas",
                color_medium: "oil",
                artistic_style: "post-impressionism",
                colors: [
                    { hex: "#FFD700", name: "Gold" },
                    { hex: "#228B22", name: "Dark Green" },
                    { hex: "#87CEEB", name: "Sky Blue" }
                ],
                tags: ["van gogh", "wheat", "cypress", "landscape", "nature"],
                status: "approved"
            },
            {
                user_id: memberUser._id,
                title: "Bathers at Asnières",
                artist: "Georges Seurat",
                image_url: "https://upload.wikimedia.org/wikipedia/commons/0/04/A_Bathing_Assisting_-_Georges_Seurat.jpg",
                cloudinary_id: "mock_cloudinary_bathers",
                description: "Pointillist summer scene of people relaxing by the Seine riverbank.",
                surface_type: "canvas",
                color_medium: "oil",
                artistic_style: "pointillism",
                colors: [
                    { hex: "#7CB342", name: "Green" },
                    { hex: "#5DADE2", name: "Blue" },
                    { hex: "#F8C471", name: "Light Gold" }
                ],
                tags: ["seurat", "pointillism", "river", "leisure", "summer"],
                status: "approved"
            },
            {
                user_id: memberUser._id,
                title: "The Gleaners",
                artist: "Jean-François Millet",
                image_url: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Millet_The_Gleaners_1857.jpg",
                cloudinary_id: "mock_cloudinary_gleaners",
                description: "Rural realist painting depicting peasant women gathering leftover wheat in a field.",
                surface_type: "canvas",
                color_medium: "oil",
                artistic_style: "realism",
                colors: [
                    { hex: "#8B7355", name: "Tan" },
                    { hex: "#DAA520", name: "Goldenrod" },
                    { hex: "#6B8E23", name: "Olive Drab" }
                ],
                tags: ["millet", "peasant", "rural", "realism", "social"],
                status: "approved"
            },
            {
                user_id: memberUser._id,
                title: "The Fighting Temeraire",
                artist: "J.M.W. Turner",
                image_url: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Turner%2C_Fighting_Temeraire%2C_1839.jpg",
                cloudinary_id: "mock_cloudinary_temeraire",
                description: "Romantic seascape of the retired warship Temeraire being towed to its final dismantling.",
                surface_type: "canvas",
                color_medium: "oil",
                artistic_style: "romanticism",
                colors: [
                    { hex: "#FFD700", name: "Gold" },
                    { hex: "#87CEEB", name: "Sky Blue" },
                    { hex: "#696969", name: "Dim Gray" }
                ],
                tags: ["turner", "ship", "sunset", "romantic", "nostalgia"],
                status: "approved"
            },
            {
                user_id: memberUser._id,
                title: "The Wanderer in the Fog",
                artist: "Caspar David Friedrich",
                image_url: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Caspar_David_Friedrich_054.jpg",
                cloudinary_id: "mock_cloudinary_wandfog",
                description: "Romantic landscape of a solitary figure contemplating a misty mountainous terrain.",
                surface_type: "canvas",
                color_medium: "oil",
                artistic_style: "romanticism",
                colors: [
                    { hex: "#2F4F4F", name: "Dark Slate Gray" },
                    { hex: "#808080", name: "Gray" },
                    { hex: "#A9A9A9", name: "Dark Gray" }
                ],
                tags: ["friedrich", "mountain", "fog", "solitude", "romantic"],
                status: "approved"
            },
            {
                user_id: memberUser._id,
                title: "The Oxbow",
                artist: "Thomas Cole",
                image_url: "https://upload.wikimedia.org/wikipedia/commons/8/89/Cole_Thomas_The_Oxbow_%28Connecticut_River%29_1836.jpg",
                cloudinary_id: "mock_cloudinary_oxbow",
                description: "Majestic Hudson River landscape depicting a dramatic bend in the river surrounded by mountains.",
                surface_type: "canvas",
                color_medium: "oil",
                artistic_style: "romanticism",
                colors: [
                    { hex: "#228B22", name: "Forest Green" },
                    { hex: "#87CEEB", name: "Sky Blue" },
                    { hex: "#D2B48C", name: "Tan" }
                ],
                tags: ["cole", "landscape", "hudson river", "american", "nature"],
                status: "approved"
            },
            {
                user_id: memberUser._id,
                title: "Nighttime Stars",
                artist: "Vincent van Gogh",
                image_url: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
                cloudinary_id: "mock_cloudinary_stars",
                description: "Iconic nighttime landscape with swirling stars and a crescent moon over a sleeping village.",
                surface_type: "canvas",
                color_medium: "oil",
                artistic_style: "post-impressionism",
                colors: [
                    { hex: "#1A1F4D", name: "Deep Blue" },
                    { hex: "#FFD700", name: "Star Yellow" },
                    { hex: "#228B22", name: "Cypress Green" }
                ],
                tags: ["van gogh", "starry night", "stars", "moon", "night"],
                status: "approved"
            },
            {
                user_id: memberUser._id,
                title: "The Flower Carrier",
                artist: "Diego Rivera",
                image_url: "https://upload.wikimedia.org/wikipedia/en/2/22/Diego_Rivera_The_Flower_Carrier.jpg",
                cloudinary_id: "mock_cloudinary_flowers",
                description: "Muralist painting depicting a figure carrying a large basket of vibrant flowers.",
                surface_type: "canvas",
                color_medium: "oil",
                artistic_style: "muralism",
                colors: [
                    { hex: "#C41E3A", name: "Red" },
                    { hex: "#FFC40C", name: "Yellow" },
                    { hex: "#228B22", name: "Green" }
                ],
                tags: ["rivera", "flowers", "mexican", "mural", "colorful"],
                status: "approved"
            },
            {
                user_id: memberUser._id,
                title: "The Inca Bridge",
                artist: "Frederic Church",
                image_url: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Frederic_Church_-_The_Inca_Bridge.jpg",
                cloudinary_id: "mock_cloudinary_incabridge",
                description: "Dramatic Andean landscape featuring a bridge spanning a deep chasm with mountains beyond.",
                surface_type: "canvas",
                color_medium: "oil",
                artistic_style: "romanticism",
                colors: [
                    { hex: "#8B4513", name: "Saddle Brown" },
                    { hex: "#87CEEB", name: "Sky Blue" },
                    { hex: "#FFD700", name: "Gold" }
                ],
                tags: ["church", "landscape", "mountains", "bridge", "south america"],
                status: "approved"
            },
            {
                user_id: memberUser._id,
                title: "The Blue Boy",
                artist: "Thomas Gainsborough",
                image_url: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Gainsborough%2C_Thomas_-_The_Blue_Boy_-_c%2E_1770.jpg",
                cloudinary_id: "mock_cloudinary_blueboy",
                description: "Portrait of a young boy dressed in rich blue attire against a romantic landscape.",
                surface_type: "canvas",
                color_medium: "oil",
                artistic_style: "rococo",
                colors: [
                    { hex: "#4169E1", name: "Royal Blue" },
                    { hex: "#A9A9A9", name: "Dark Gray" },
                    { hex: "#228B22", name: "Green" }
                ],
                tags: ["gainsborough", "portrait", "boy", "blue", "rococo"],
                status: "approved"
            },
            {
                user_id: memberUser._id,
                title: "The Pink and Brown Hat",
                artist: "Mary Cassatt",
                image_url: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Mary_Cassatt_-_The_Pink_and_Brown_Hat.jpg",
                cloudinary_id: "mock_cloudinary_hat",
                description: "Intimate portrait of a woman adjusting her fashionable hat in an impressionist style.",
                surface_type: "canvas",
                color_medium: "oil",
                artistic_style: "impressionism",
                colors: [
                    { hex: "#FFB6C1", name: "Light Pink" },
                    { hex: "#8B4513", name: "Brown" },
                    { hex: "#E8E8E8", name: "Off White" }
                ],
                tags: ["cassatt", "portrait", "woman", "fashion", "impressionism"],
                status: "approved"
            },
            {
                user_id: memberUser._id,
                title: "The Bedroom",
                artist: "Vincent van Gogh",
                image_url: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Van_Gogh_-_Vincents_Bedroom_in_Arles.jpg",
                cloudinary_id: "mock_cloudinary_bedroom",
                description: "Simple interior of Van Gogh's bedroom with purple walls and warm color scheme.",
                surface_type: "canvas",
                color_medium: "oil",
                artistic_style: "post-impressionism",
                colors: [
                    { hex: "#9370DB", name: "Medium Purple" },
                    { hex: "#D2B48C", name: "Tan" },
                    { hex: "#FFD700", name: "Yellow" }
                ],
                tags: ["van gogh", "bedroom", "interior", "intimate", "home"],
                status: "approved"
            },
            {
                user_id: memberUser._id,
                title: "A Bar at the Folies-Bergère",
                artist: "Édouard Manet",
                image_url: "https://upload.wikimedia.org/wikipedia/commons/0/0d/A_bar_at_the_Folies_Bergère.jpg",
                cloudinary_id: "mock_cloudinary_bar",
                description: "Modern urban scene of a barmaid at a cabaret with reflected patrons and bottles.",
                surface_type: "canvas",
                color_medium: "oil",
                artistic_style: "impressionism",
                colors: [
                    { hex: "#FFFFFF", name: "White" },
                    { hex: "#FFD700", name: "Gold" },
                    { hex: "#2F4F4F", name: "Dark Slate" }
                ],
                tags: ["manet", "cabaret", "urban", "reflection", "modern"],
                status: "approved"
            },
            {
                user_id: memberUser._id,
                title: "The Dance",
                artist: "Henri Matisse",
                image_url: "https://upload.wikimedia.org/wikipedia/en/e/e8/Matisse_dance.jpg",
                cloudinary_id: "mock_cloudinary_dance",
                description: "Dynamic composition of five dancing figures in vibrant colors against a contrasting background.",
                surface_type: "canvas",
                color_medium: "oil",
                artistic_style: "fauvism",
                colors: [
                    { hex: "#E74C3C", name: "Red" },
                    { hex: "#3498DB", name: "Blue" },
                    { hex: "#27AE60", name: "Green" }
                ],
                tags: ["matisse", "dance", "movement", "fauvism", "vibrant"],
                status: "approved"
            }
        ];

        const insertedPaintings = await Painting.insertMany(paintings);
        
        // Link paintings back to the member user
        const paintingIds = insertedPaintings.map(p => p._id);
        memberUser.uploaded_paintings = paintingIds;
        await memberUser.save();

        console.log(`✅ Successfully seeded ${insertedPaintings.length} paintings!`);
        console.log("Database seeding completed!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Error seeding database:", err);
        process.exit(1);
    }
};

seedData();
