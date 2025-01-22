const session = require('express-session');
require('dotenv').config();

const sessionConfig = session({
    secret: process.env.APP_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'PROD',
    },
});

module.exports = sessionConfig;
