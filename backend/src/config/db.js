const mongoose = require('mongoose');

async function connectDB() {
    console.log('DEBUG: The value of MONGO_URL is:', process.env.MONGO_URL);
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            
        });
        console.log("MongoDB connected!");
    } catch (error) {
        console.error('Error to connect MongoDB.', error);
        process.exit(1);
    }
};

module.exports = connectDB;