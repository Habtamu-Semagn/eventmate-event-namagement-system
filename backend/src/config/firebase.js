const admin = require('firebase-admin');

// Check if valid Firebase credentials are provided (not placeholder values)
const hasFirebaseCredentials = () => {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

    // Check if credentials exist and are not placeholder values
    const isValidProjectId = projectId && projectId !== 'placeholder' && projectId !== 'your-project-id';
    const isValidPrivateKey = privateKey &&
        !privateKey.includes('placeholder') &&
        privateKey.includes('BEGIN PRIVATE KEY');
    const isValidClientEmail = clientEmail &&
        !clientEmail.includes('placeholder') &&
        (clientEmail.includes('@iam.gserviceaccount.com') || clientEmail.includes('gserviceaccount.com'));

    return isValidProjectId && isValidPrivateKey && isValidClientEmail;
};

// Initialize Firebase Admin SDK only if credentials are provided
let adminInstance = null;
let dbInstance = null;
let authInstance = null;

if (hasFirebaseCredentials()) {
    // Firebase service account configuration
    const serviceAccount = {
        type: 'service_account',
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
    };

    try {
        // Check if Firebase is already initialized
        adminInstance = admin.app();
        console.log('Firebase Admin SDK already initialized');
    } catch (error) {
        // Initialize Firebase Admin SDK
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: process.env.FIREBASE_DATABASE_URL,
        });
        adminInstance = admin;
        console.log('Firebase Admin SDK initialized successfully');
    }

    dbInstance = adminInstance.firestore();
    authInstance = adminInstance.auth();
} else {
    console.warn('⚠️  Firebase credentials not provided or invalid. Firebase features will be disabled.');
    console.warn('Please configure your Firebase credentials in the .env file using .env.example as reference.');
}

// Export admin for use in other files
module.exports = {
    admin: adminInstance,
    db: dbInstance,
    auth: authInstance,
    isFirebaseConfigured: hasFirebaseCredentials(),
};
