const bcrypt = require("bcrypt");

class Authorisation {
    verifyPassword(enteredPassword, hashedPassword) {
        bcrypt.compare(enteredPassword, hashedPassword, (err, isMatch) => {
            if (err) {
                throw new Error(`Ошибка при сравнении паролей: \n${err}`);
            }

            if (isMatch) {
                console.log('Пароль правильный!');
                return true;
            } else {
                console.log('Неверный пароль!');
                return false;
            }
        });
    }
}

module.exports = Authorisation;
