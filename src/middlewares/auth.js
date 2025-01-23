function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated) {
        return next();
    }
    console.log('You are not authorized');
    return res.status(401).json({ message: 'You are not authorized' });
}

module.exports = { ensureAuthenticated };
