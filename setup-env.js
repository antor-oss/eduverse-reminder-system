const https = require('https');

const projectId = 'prj_M0JWc6lkginQKFpuYvLHIO74toSr';
const token = process.env.VERCEL_TOKEN;

const envVars = {
  NEXT_PUBLIC_FIREBASE_API_KEY: 'AIzaSyDTgA19sz07lb2vfpgQ_1wwgecNc67xKq4',
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: 'eduverse-reminder-system.firebaseapp.com',
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'eduverse-reminder-system',
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: 'eduverse-reminder-system.firebasestorage.app',
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: '290203926388',
  NEXT_PUBLIC_FIREBASE_APP_ID: '1:290203926388:web:13dc0576ce3af3bb857621',
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: 'G-SSC2QVZE8D'
};

async function setEnvVars() {
  for (const [key, value] of Object.entries(envVars)) {
    const data = JSON.stringify({
      key,
      value,
      target: ['production', 'preview', 'development']
    });

    const options = {
      hostname: 'api.vercel.com',
      port: 443,
      path: `/v9/projects/${projectId}/env`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'Authorization': `Bearer ${token}`
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => console.log(`✓ ${key} set`));
    });

    req.on('error', console.error);
    req.write(data);
    req.end();
  }
}

setEnvVars();
