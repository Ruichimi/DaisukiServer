function checkRole(requiredRole) {
    return (req, res, next) => {
        console.log(req.user);
        if (req.user.role !== requiredRole) {
            return res.status(403).send('Нет доступа');
        }
        next();
    };
}

module.exports = { checkRole };
