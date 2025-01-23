function checkRole(requiredRole) {
    return (req, res, next) => {
        if (!req.isAuthenticated || !req.isAuthenticated()) {
            return res.status(401).send('Не авторизован');
        }
        if (req.user.role !== requiredRole) {
            return res.status(403).send('Нет доступа');
        }
        next();
    };
}

module.exports = { checkRole };
