const express = require('express');
const Registration = require('../services/auth/registration');
const { checkRole }  = require('@src/middlewares/checkRole');
const Auth = require('@src/services/auth/authorization');
const passportJwt = require('@src/services/auth/passportJwt');
const passport = require('passport');
const router = express.Router();
const jwt = require('jsonwebtoken');


router.use(passport.initialize());

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

router.post('/api/authorize', async (req, res) => {
    const { login, password } = req.body;
    try {
        const token = await Auth.auth(login, password);
        res.json({ message: 'Авторизация успешна', token, loggedIn: true });
    } catch (error) {
        console.error('Ошибка авторизации:', error);
        res.status(500).json({ message: 'Ошибка на сервере' });
    }
});

router.get('/api/dashboard', passportJwt.authenticate('jwt', { session: false }), (req, res) => {
    console.log(req.user);
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    res.json({ message: `Welcome to your dashboard, ${req.user.username}!` });
});
router.get('/api/admin', passportJwt.authenticate('jwt', { session: false }), checkRole('admin'), (req, res) => {
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
