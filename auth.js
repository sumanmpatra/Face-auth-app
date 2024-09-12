// const express = require('express');
// const router = express.Router();
// const { verifyLiveness, compareFaces } = require('../../../utils/faceRecognition');
// const User = require('../../../models/User');

// // Register Face Route
// router.post('/register', async (req, res) => {
//     const { username, image } = req.body; // Image is a base64-encoded string

//     try {
//         // Verify liveness
//         const isLive = await verifyLiveness(image);
//         if (!isLive) return res.status(400).json({ message: 'Liveness verification failed' });

//         // Generate face embedding (this is a mock function, implement accordingly)
//         const faceEmbedding = await generateFaceEmbedding(image);

//         // Save user in database
//         const newUser = new User({ username, faceEmbedding });
//         await newUser.save();
//         res.status(201).json({ message: 'User registered successfully' });
//     } catch (error) {
//         res.status(500).json({ message: 'Error registering user', error: error.message });
//     }
// });

// // Authenticate Face Route
// router.post('/authenticate', async (req, res) => {
//     const { username, image } = req.body;

//     try {
//         // Verify liveness
//         const isLive = await verifyLiveness(image);
//         if (!isLive) return res.status(400).json({ message: 'Liveness verification failed' });

//         // Generate face embedding
//         const faceEmbedding = await generateFaceEmbedding(image);

//         // Find user and compare face embeddings
//         const user = await User.findOne({ username });
//         if (!user) return res.status(404).json({ message: 'User not found' });

//         const isMatch = await compareFaces(faceEmbedding, user.faceEmbedding);
//         if (isMatch) {
//             res.status(200).json({ message: 'Authentication successful' });
//         } else {
//             res.status(401).json({ message: 'Authentication failed' });
//         }
//     } catch (error) {
//         res.status(500).json({ message: 'Error during authentication', error: error.message });
//     }
// });

// module.exports = router;




const express = require('express');
const router = express.Router();
const { verifyLiveness, generateFaceEmbedding, compareFaces } = require('../utils/faceRecognition');
const User = require('../models/User');

// Register User and Store Reference Data
router.post('/register', async (req, res) => {
    const { username, image } = req.body; // Image is a base64-encoded string

    try {
        // Verify liveness
        const isLive = await verifyLiveness(image);
        if (!isLive) return res.status(400).json({ message: 'Liveness verification failed' });

        // Generate face embedding from the registration image
        const faceEmbedding = await generateFaceEmbedding(image);

        // Store user data with face embedding in the database
        const newUser = new User({ username, faceEmbedding });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

// Authenticate User
router.post('/authenticate', async (req, res) => {
    const { username, image } = req.body;

    try {
        // Verify liveness of the authentication attempt
        const isLive = await verifyLiveness(image);
        if (!isLive) return res.status(400).json({ message: 'Liveness verification failed' });

        // Generate face embedding from the current image
        const faceEmbedding = await generateFaceEmbedding(image);

        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Compare the embeddings for authentication
        const isMatch = await compareFaces(faceEmbedding, user.faceEmbedding);
        if (isMatch) {
            res.status(200).json({ message: 'Authentication successful' });
        } else {
            res.status(401).json({ message: 'Authentication failed' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error during authentication', error: error.message });
    }
});

module.exports = router;
