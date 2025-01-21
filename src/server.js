require('dotenv').config();
const flash = require('connect-flash');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const Registration = require('./services/auth/registration');

require('./services/auth/passport');

const app = express();
const port = 3000;

app.use(cors({
    origin: 'http://localhost:3333',
    credentials: true,
}));
app.use(express.json());

// Настройка сессий
app.use(session({
    secret: process.env.APP_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    },
}));

// Инициализация Passport.js
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Регистрация пользователя
app.post('/api/registration', async (req, res) => {
    const userdata = req.body;
    console.log('Регистрация:', userdata);

    try {
        new Registration(userdata);
        res.status(201).json({ message: 'Пользователь зарегистрирован!' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка регистрации', error: error.message });
    }
});


app.post('/api/authorize', (req, res, next) => {
    console.log('Запрос на авторизацию:', req.body);
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error('Ошибка при авторизации:', err);
            return next(err);
        }
        if (!user) {
            console.error('Неудачная попытка авторизации:', info.message);  // Логирование неудачи
            return res.status(401).json({ message: 'Ошибка авторизации', error: info.message });
        }

        req.logIn(user, (loginErr) => {
            if (loginErr) {
                console.error('Ошибка при входе:', loginErr);
                return next(loginErr);
            }

            return res.json({ message: 'Авторизация успешна', user });
        });
    })(req, res, next);
});

app.post('/api/dashboard', (req, res) => {
    if (!req.isAuthenticated()) {
        console.log('You are not authorized');
        return res.json({ message: 'You are not authorized' }); // Отправляем ответ с кодом ошибки и сообщением в JSON
    }
    console.log('Welcome to your dashboard!');
    res.json({ message: 'Welcome to your dashboard!' }); // Возвращаем данные в формате JSON
});

app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).send('Ошибка выхода');
        }
        res.redirect('/');
    });
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
