const pool = require('../connect');

(async () => {
    try {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users
            (
                id            SERIAL PRIMARY KEY,
                username      VARCHAR(50)         NOT NULL,
                email         VARCHAR(100) UNIQUE NOT NULL,
                role          VARCHAR(50)         DEFAULT 'user',
                password_hash VARCHAR(255)        NOT NULL,
                created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        await pool.query(createTableQuery);
        console.log('Table has successfully created.');
    } catch (error) {
        console.error('Error with table creating:', error.message);
    } finally {
        await pool.end();
    }
})();
