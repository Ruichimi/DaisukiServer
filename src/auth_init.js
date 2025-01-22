const passport = require('passport');
const flash = require('connect-flash');

module.exports = (app) => {
    app.use(require('@config/session'));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());
};
