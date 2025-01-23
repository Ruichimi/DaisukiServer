require('@src/services/auth/passport');
const express = require('express');
const passport = require('passport');
const Registration = require('../services/auth/registration');
const authConfig = require("../auth_init");
const { checkRole }  = require('@src/middlewares/checkRole');
const { ensureAuthenticated }  = require('@src/middlewares/auth');

const router = express.Router();

authConfig(router);
router.post('/api/registration', async (req, res) => {
    const userdata = req.body;
    console.log('Регистрация:', userdata);

    try {
        new Registration(userdata);
        res.status(201).json({ message: 'Пользователь зарегистрирован!' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка регистрации', error: error.message });
    }
});

router.post('/api/authorize', (req, res, next) => {
    console.log('Запрос на авторизацию:', req.body);
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error('Ошибка при авторизации:', err);
            return next(err);
        }
        if (!user) {
            console.error('Неудачная попытка авторизации:', info.message);
            return res.status(401).json({ message: 'Ошибка авторизации', error: info.message });
        }

        req.logIn(user, (loginErr) => {
            if (loginErr) {
                console.error('Ошибка при входе:', loginErr);
                return next(loginErr);
            }

            return res.json({ message: 'Авторизация успешна', user, loggedIn: true });
        });
    })(req, res, next);
});

router.post('/api/dashboard', ensureAuthenticated, (req, res) => {
    if (!req.isAuthenticated()) {
        console.log('You are not authorized');
        return res.json({ message: 'You are not authorized' });
    }
    console.log('Welcome to your dashboard!');
    res.json({ message: 'Welcome to your dashboard!' });
});

router.get('/api/admin', ensureAuthenticated, checkRole('admin'), (req, res) => {
    res.json({ message: 'Welcome to admin panel!' });
});

router.post('/api/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.log('Failed to logout user');
            return res.status(500).send('Ошибка выхода');
        }
        res.status(200).send('Successfully logged out');
    });
});

module.exports = router;
