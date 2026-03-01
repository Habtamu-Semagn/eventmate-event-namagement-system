const { Pool } = require('pg');
require('dotenv').config();

// Create a new pool with environment variables
const poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'eventmate',
    user: process.env.DB_USER || 'postgres',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
};

// Use empty string if password is not set
const dbPassword = process.env.DB_PASSWORD;
if (dbPassword !== undefined && dbPassword !== null && dbPassword !== '') {
    poolConfig.password = dbPassword;
}

const pool = new Pool(poolConfig);

// Test the connection
pool.on('connect', () => {
    console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

// Export the pool for use in other modules
module.exports = {
    query: (text, params) => pool.query(text, params),
    pool,

    // Helper method to get a client from the pool
    getClient: () => pool.connect(),

    // Method to initialize the database with schema
    initialize: async () => {
        const fs = require('fs');
        const path = require('path');

        try {
            // Try to read schema file and execute
            const schemaPath = path.join(__dirname, 'schema.sql');
            const schema = fs.readFileSync(schemaPath, 'utf8');

            console.log('Initializing database schema...');

            // Split and execute each statement - ignore errors (tables may already exist)
            const statements = schema.split(';');

            for (const stmt of statements) {
                const trimmed = stmt.trim();
                if (trimmed && !trimmed.startsWith('--')) {
                    try {
                        await pool.query(trimmed);
                    } catch (e) {
                        // Ignore errors - table may already exist
                    }
                }
            }

            console.log('Database schema initialized');

            // Try to create admin user
            try {
                const bcrypt = require('bcryptjs');
                const adminPassword = await bcrypt.hash('admin123', 10);

                await pool.query(
                    `INSERT INTO users (name, email, password_hash, role) 
                     VALUES ($1, $2, $3, $4)
                     ON CONFLICT (email) DO NOTHING`,
                    ['Administrator', 'admin@eventmate.com', adminPassword, 'Administrator']
                );
                console.log('Admin user ready');
            } catch (e) {
                // Admin might already exist
                console.log('Admin user check done');
            }

            return true;
        } catch (error) {
            console.error('Error initializing database:', error.message);
            // Don't throw - continue anyway
            return false;
        }
    }
};
