const pool = require('./connect');

(async () => {
    try {
        const result = await pool.query('SELECT NOW();');
        console.log('Подключение успешно:', result.rows);
    } catch (error) {
        console.error('Ошибка подключения:', error.message);
    } finally {
        await pool.end();
    }
})();
