const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const url = 'mongodb+srv://sonicdev:F_*E5Ja98i$$2q3@cluster0.r5nc91a.mongodb.net/restruant';
        await mongoose.connect(url);
        console.log('MongoDB Atlas connected');
    } catch (error) {
        console.error('Failed to connect to DB:', error);
    }
};

module.exports = connectDB;
// mongodb://127.0.0.1:27017/notes - laptop url