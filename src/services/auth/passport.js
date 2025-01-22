const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const AuthBD = require('./UserTableHelper');

/**
 * @typedef {import('../../intarfaces/userTypes').User} User
 */

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await AuthBD.getUserById(id);
        if (user) {
            done(null, user);
        } else {
            done(new Error('Пользователь не найден'));
        }
    } catch (error) {
        done(error);
    }
});

// Локальная стратегия для аутентификации
passport.use(new LocalStrategy(
    {
        usernameField: 'login',
        passwordField: 'password',
    },
    async (login, password, done) => {
        try {
            const user = await AuthBD.getUserDataByLogin(login);
            if (user) {
                const isMatch = await AuthBD.verifyPassword(password, user.password_hash);
                if (isMatch) {
                    console.log(`Пользователь ${user.username} successfully logged in`);
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Неверный пароль!' });
                }
            } else {
                return done(null, false, { message: 'Пользователь не найден.' });
            }
        } catch (error) {
            return done(error);
        }
    }
));

module.exports = passport;
