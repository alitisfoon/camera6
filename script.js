// لینک به CDN های لازم
const faceApiScript = document.createElement('script');
faceApiScript.src = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.3.0';
document.head.appendChild(faceApiScript);

faceApiScript.onload = function() {
    // شروع ویدیو
    async function startVideo() {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        document.getElementById('video').srcObject = stream;
    }
    startVideo();

    // بارگذاری مدل‌ها
    async function loadModels() {
        await faceapi.nets.tinyFaceDetector.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models');
        detectFaces();
    }
    loadModels();

    // شناسایی چهره‌ها
    async function detectFaces() {
        const video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        const displaySize = { width: video.width, height: video.height };
        faceapi.matchDimensions(canvas, displaySize);

        setInterval(async () => {
            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
            faceapi.draw.drawDetections(canvas, resizedDetections);
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        }, 100);
    }
};
