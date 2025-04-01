const https = require('https');
setInterval(() => {
  https.get('https://your-app.vercel.app/_warmup');
}, 300000); // Ping every 5 minutes