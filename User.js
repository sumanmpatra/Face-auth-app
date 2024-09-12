// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//     username: { type: String, required: true, unique: true },
//     faceEmbedding: { type: Array, required: true }, // Store embedding as an array
// });

// module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    faceEmbedding: { type: Array, required: true }, // Storing embedding as an array
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
