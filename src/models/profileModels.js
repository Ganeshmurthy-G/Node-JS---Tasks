const handleConnection = require("../config/db");
const bcrypt = require('bcryptjs');

const user = {

    getAllUsers: (callback) => {
        handleConnection.query("SELECT * FROM profiles", (error, results) => {
            if (error) return callback(error);
            callback(null, results);
        })
    },

    getUserById: (userId, callback) => {
        handleConnection.query("SELECT * FROM profiles WHERE id = ?", [userId], (error, results) => {
            if (error) return callback(error);
            callback(null, results[0]);
        })
    },

    createUser: async (userData, callback) => {
        console.log('userData model: ', userData);
        try {

            const { name, email, password } = userData;
            console.log('name: ', name);
            console.log('email: ', email);
            console.log('password: ', password);

            const hashedPassword = await bcrypt.hash(password, 10);
            console.log('hashedPassword: ', hashedPassword);

            const sql = "INSERT INTO profiles (name, email, password) VALUES (?, ?, ?)";

            handleConnection.query(sql, [name, email, hashedPassword], (error, result) => {
                console.log('result in model: ', result);
                if (error) return callback(error);
                callback(null, { id: result.insertId, name, email });
            });
        }
        catch (error) {
            console.log('error in createUser: ', error);
            callback(error);
        }
    },

    updateUser: (userData, callback) => {
        console.log('userData in db.js --> ', userData);

        const { id, name, email } = userData;

        const sql = `UPDATE profiles SET name = ?, email = ? WHERE id = ?`;

        handleConnection.query(sql, [name, email, id], (error, result) => {
            console.log('result: ', result);

            if (error) return callback(error);

            if (result.affectedRows === 0) {
                return callback(null, null);
            }

            callback(null, { id, name, email });
        })
    },

    deleteUser: (userId, callback) => {
        console.log("userId in delete in db.js", userId);

        const sql = `DELETE FROM profiles WHERE id = ?`;

        handleConnection.query(sql, [userId], (error, result) => {
            console.log('result: ', result);
            if (error) return callback(error);

            if (result.affectedRows === 0) {
                return callback(null, null);
            }

            callback(null, result);
        })
    },

    patchUpdateUser: (userData, callback) => {
        console.log('userData: ', userData);

        const { id, name, email } = userData;

        const fields = [];
        const values = [];

        if (name !== undefined) {
            fields.push("name = ?");
            values.push(name);
        }

        if (email !== undefined) {
            fields.push("email = ?");
            values.push(email);
        }

        if (fields.length === 0) {
            return callback(null, null);
        }

        const sql = `UPDATE profiles SET ${fields.join(", ")} WHERE id = ?`;
        values.push(id);

        handleConnection.query(sql, values, (err, profile) => {
            if (err) return callback(err);

            if (profile.affectedRows === 0) {
                return callback(null, null);
            }

            callback(null, profile);
        });
    }
}

module.exports = user;