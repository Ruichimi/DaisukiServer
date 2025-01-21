const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const path = require('path');
const pool = require(path.join(process.cwd(), 'database', 'connect.js'));

/**
 * @typedef {import('../userTypes').User} User
 */

// Сериализация и десериализация пользователя для сессий
passport.serializeUser((user, done) => {
    done(null, user.id);  // Сохраняем ID пользователя в сессии
});

passport.deserializeUser(async (id, done) => {
    try {
        const query = `
            SELECT * FROM users WHERE id = $1 LIMIT 1;
        `;
        const { rows } = await pool.query(query, [id]);
        if (rows.length > 0) {
            done(null, rows[0]);
        } else {
            done(new Error('Пользователь не найден'));
            console.log('Пользователь не найден');
        }
    } catch (error) {
        done(error);
    }
});

// Локальная стратегия для аутентификации
passport.use(new LocalStrategy(
    {
        usernameField: 'login',  // Указываем, что поле для логина — 'login'
        passwordField: 'password', // Стандартное поле для пароля
    },
    async (login, password, done) => {
        try {
            const query = `
                SELECT *,
                    CASE
                        WHEN email = $1 THEN 'email'
                        WHEN username = $1 THEN 'username'
                    END AS found_by
                FROM users
                WHERE email = $1 OR username = $1
                LIMIT 1;
            `;
            const { rows } = await pool.query(query, [login]);

            if (rows.length > 0) {
                const user = /** @type {User} */ (rows[0]);
                console.log(`Пользователь найден по полю: ${user.found_by}`);

                // Сравнение пароля
                bcrypt.compare(password, user.password_hash, (err, isMatch) => {
                    if (err) {
                        return done(err);
                    }

                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Неверный пароль!' });
                    }
                });
            } else {
                console.log('Пользователь не найден.');
                return done(null, false, { message: 'Пользователь не найден.' });
            }
        } catch (error) {
            return done(error);
        }
    }
));

module.exports = passport;
