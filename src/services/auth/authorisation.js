const bcrypt = require("bcrypt");
const path = require("path");
const pool = require(path.join(process.cwd(), 'database', 'connect.js'));

/**
 * @typedef {import('../userTypes').User} User
 */

class UserTableHelper {
    async getUserById(id) {
        const query = `
            SELECT *
            FROM users
            WHERE id = $1 LIMIT 1;
        `;
        const {rows} = await pool.query(query, [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    async getUserDataByLogin(userLogin) {
        try {
            const query = `
                SELECT *,
                       CASE
                           WHEN email = $1 THEN 'email'
                           WHEN username = $1 THEN 'username'
                           END AS found_by
                FROM users
                WHERE email = $1
                   OR username = $1 LIMIT 1;
            `;
            const {rows} = await pool.query(query, [userLogin]);
            if (rows.length > 0 && Object.keys(rows[0]).length > 0) {
                const user = /** @type {User} */ (rows[0]);
                //console.log(`Пользователь найден по полю: ${user.found_by}`);
                return user;
            } else {
                return null;
            }
        } catch (error) {
            throw new Error(`Ошибка при запросе к базе данных: \n${error.message}`);
        }
    }

    verifyPassword(enteredPassword, hashedPassword) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(enteredPassword, hashedPassword, (err, isMatch) => {
                if (err) {
                    reject(new Error(`Ошибка при сравнении паролей: \n${err}`));
                } else if (isMatch) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }
}

module.exports = new UserTableHelper();
