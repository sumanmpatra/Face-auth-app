// const video = document.getElementById('webcam');
// const canvas = document.getElementById('canvas');
// const context = canvas.getContext('2d');
// const statusDiv = document.getElementById('status');
// let model;

// // Initialize Webcam
// async function initWebcam() {
//     try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
//         video.srcObject = stream;
//         await new Promise(resolve => video.onloadedmetadata = resolve);
//         video.play();
//         statusDiv.innerText = 'Webcam initialized. Loading model...';
//     } catch (error) {
//         console.error('Error initializing webcam:', error);
//         statusDiv.innerText = 'Failed to initialize webcam.';
//     }
// }

// // Load Liveness Detection Model
// async function loadModel() {
//     try {
//         // Replace with your model's path
//         model = await tf.loadGraphModel('https://example.com/model/model.json');
//         statusDiv.innerText = 'Model loaded. Click "Start Detection" to begin.';
//     } catch (error) {
//         console.error('Error loading model:', error);
//         statusDiv.innerText = 'Failed to load the model.';
//     }
// }

// // Liveness Detection Function
// async function detectLiveness() {
//     try {
//         // Draw video frame to canvas
//         canvas.width = video.videoWidth;
//         canvas.height = video.videoHeight;
//         context.drawImage(video, 0, 0, canvas.width, canvas.height);

//         // Convert canvas image to tensor
//         const imageTensor = tf.browser.fromPixels(canvas)
//             .resizeNearestNeighbor([224, 224]) // Resize to model's input size
//             .toFloat()
//             .expandDims(0); // Add batch dimension

//         // Run liveness detection model
//         const prediction = model.predict(imageTensor);
//         const [liveScore] = prediction.dataSync(); // Assuming binary classification (0 - fake, 1 - live)

//         // Update UI with result
//         if (liveScore > 0.5) {
//             statusDiv.innerText = 'Live Face Detected';
//         } else {
//             statusDiv.innerText = 'Spoof Detected';
//         }

//         tf.dispose(imageTensor);

//         // Repeat detection every 500ms
//         setTimeout(detectLiveness, 500);
//     } catch (error) {
//         console.error('Error during detection:', error);
//         statusDiv.innerText = 'Error during detection.';
//     }
// }

// // Initialize everything
// async function init() {
//     statusDiv.innerText = 'Initializing webcam...';
//     await initWebcam();
//     await loadModel();
//     detectLiveness();
// }


const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const statusDiv = document.getElementById('status');
const startButton = document.getElementById('start-button');
let model;

// Initialize Webcam
async function initWebcam() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        video.srcObject = stream;
        await new Promise(resolve => video.onloadedmetadata = resolve);
        video.play();
        statusDiv.innerText = 'Webcam initialized. Loading model...';
    } catch (error) {
        console.error('Error initializing webcam:', error);
        statusDiv.innerText = 'Failed to initialize webcam.';
    }
}

// Load Liveness Detection Model (if using a local model for quick feedback)
async function loadModel() {
    try {
        // Optionally load a client-side model for real-time feedback (example only)
        model = await tf.loadGraphModel('https://example.com/model/model.json'); // Replace with your model URL
        statusDiv.innerText = 'Model loaded. Click "Start Detection" to begin.';
    } catch (error) {
        console.error('Error loading model:', error);
        statusDiv.innerText = 'Failed to load the model.';
    }
}

// Capture Image and Convert to Base64
function captureImage() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg'); // Convert canvas image to base64 string
}

// Make API Call to Backend for Face Authentication
async function authenticateUser(image) {
    try {
        const response = await fetch('/api/auth/authenticate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'testUser', image: image })
        });

        const result = await response.json();
        statusDiv.innerText = result.message;
    } catch (error) {
        console.error('Error during API call:', error);
        statusDiv.innerText = 'Error during authentication.';
    }
}

// Perform Liveness Detection and Authentication
async function detectLiveness() {
    try {
        // Capture image from webcam
        const imageBase64 = captureImage();

        // Optionally perform client-side liveness detection using TensorFlow.js model
        // Uncomment below if you are using a client-side model for faster feedback
        /*
        const imageTensor = tf.browser.fromPixels(canvas)
            .resizeNearestNeighbor([224, 224]) // Adjust to model input size
            .toFloat()
            .expandDims(0); // Add batch dimension

        const prediction = model.predict(imageTensor);
        const isLive = prediction.dataSync()[0] > 0.5; // Assuming binary classification
        tf.dispose(imageTensor);

        if (!isLive) {
            statusDiv.innerText = 'Spoof Detected - Not Live';
            return;
        }
        */

        // Send image to backend for liveness verification and face authentication
        await authenticateUser(imageBase64);

    } catch (error) {
        console.error('Error during detection:', error);
        statusDiv.innerText = 'Error during detection.';
    }
}

// Initialize Everything
async function init() {
    statusDiv.innerText = 'Initializing webcam...';
    await initWebcam();
    await loadModel(); // Optional, remove if not using a local model
    startButton.onclick = detectLiveness;
}

init();
