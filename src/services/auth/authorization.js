const bcrypt = require("bcrypt");
const AuthBD = require('@src/services/auth/UserTableHelper');
const jwt = require("jsonwebtoken");


class Authorization {
    async auth(login, password) {
        const user = await AuthBD.getUserDataByLogin(login);
        if (!user) {
            throw new Error('User not found');
        }

        const isMatch = await this.verifyPassword(password, user.password_hash);

        if (isMatch) {
            console.log(`User ${user.username} has authorized`);
            const payload = { id: user.id, username: user.username, role: user.role };
            return jwt.sign(payload, process.env.APP_KEY, {expiresIn: '1000h'});
        } else {
            throw new Error('Wrong password');
        }
    }

    async verifyPassword(enteredPassword, hashedPassword) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(enteredPassword, hashedPassword, (err, isMatch) => {
                if (err) {
                    reject(new Error(`Ошибка при сравнении паролей: \n${err}`));
                } else if (isMatch) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }
}

module.exports = new Authorization();
