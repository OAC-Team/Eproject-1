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
