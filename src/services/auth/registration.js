const validator = require('validator');
const bcrypt = require('bcrypt');
const path = require('path');
const pool = require(path.join(process.cwd(), 'database', 'connect.js'));

class Registration {
    constructor(userdata) {
        this.#registrate(userdata);
    }

    async #registrate(userdata) {
        const validationResult = this.#validateData(userdata);
        if (!validationResult.isValid) {
            console.log("Validation failed with registration:", validationResult.errors);
            return;
        }

        const hashedPassword = await this.#hashPassword(userdata.password);

        const { isUnique, isUsernameUnique, isEmailUnique } = await this.#isUserEmailAndNameUniqueDB(userdata.username, userdata.email);
        if (isUnique) {
            await this.#addUserToDatabase(userdata, hashedPassword);
            console.log(`User ${userdata.username} has been registered`);
        } else {
            const existingData = [
                !isUsernameUnique && "username",
                !isEmailUnique && "email"
            ].filter(Boolean).join(" and ");
            console.log(`Registration failed: ${existingData} already exists.`);
        }
    }

    async #isUserEmailAndNameUniqueDB(username, email) {
        const selectQuery = `
        SELECT
            (SELECT COUNT(*) FROM users WHERE username = $1) AS username_count,
            (SELECT COUNT(*) FROM users WHERE email = $2) AS email_count
    `;

        try {
            const result = await pool.query(selectQuery, [username, email]);
            const usernameCount = parseInt(result.rows[0].username_count, 10);
            const emailCount = parseInt(result.rows[0].email_count, 10);

            return {
                isUnique: usernameCount === 0 && emailCount === 0,
                isUsernameUnique: usernameCount === 0,
                isEmailUnique: emailCount === 0
            };
        } catch (error) {
            console.error('Error checking user uniqueness in database:', error.message);
            return {
                isUnique: false,
                isUsernameUnique: false,
                isEmailUnique: false
            };
        }
    }

    #validateData(data) {
        const errors = [];

        if (!data.username || data.username.length < 3) {
            errors.push('Name must be at least 3 characters long');
        }

        if (!data.email || !validator.isEmail(data.email)) {
            errors.push('Invalid email');
        }

        if (!data.password || data.password.length < 6) {
            errors.push('Password must be at least 6 characters long');
        }

        // Removing ` from every field
        Object.values(data).forEach((field) => {
            if (field.includes('`')) {
                errors.push(`The ${field} contains forbidden character`);
            }
        });

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    async #hashPassword(password) {
        try {
            const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
            return await bcrypt.hash(password, saltRounds);
        } catch (error) {
            console.error("Error hashing password:", error);
        }
    }

    async #addUserToDatabase(userdata, hashedPassword) {
        const insertQuery = `
            INSERT INTO users (username, email, password_hash)
            VALUES ($1, $2, $3)
        `;

        try {
            await pool.query(insertQuery, [userdata.username, userdata.email, hashedPassword]);
            console.log('User successfully added to the database');
        } catch (error) {
            console.error('Error adding user to the database:', error.message);
        }
    }
}

module.exports = Registration;
