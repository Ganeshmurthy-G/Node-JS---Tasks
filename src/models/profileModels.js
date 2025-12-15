const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const Profile = {
    getAllUsers: async () => {
        const [rows] = await pool.query("SELECT * FROM profiles");
        return rows;
    },

    getUserById: async (id) => {
        const [rows] = await pool.query("SELECT * FROM profiles WHERE id = ?", [id]);
        return rows[0];
    },

    createUser: async ({ name, email, password }) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            "INSERT INTO profiles (name, email, password) VALUES (?, ?, ?)",
            [name, email, hashedPassword]
        );
        return { id: result.insertId, name, email };
    },

    updateUser: async ({ id, name, email }) => {
        const [result] = await pool.query(
            "UPDATE profiles SET name = ?, email = ? WHERE id = ?",
            [name, email, id]
        );
        if (result.affectedRows === 0) return null;
        return { id, name, email };
    },

    deleteUser: async (id) => {
        const [result] = await pool.query(
            "DELETE FROM profiles WHERE id = ?",
            [id]
        );
        return result.affectedRows > 0 ? result : null;
    },

    patchUpdateUser: async ({ id, name, email }) => {
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
        if (fields.length === 0) return null;

        const sql = `UPDATE profiles SET ${fields.join(", ")} WHERE id = ?`;
        values.push(id);

        const [result] = await pool.query(sql, values);
        return result.affectedRows > 0 ? { id, name, email } : null;
    }
};

module.exports = Profile;



// const handleConnection = require("../config/db");
// const bcrypt = require('bcryptjs');

// const user = {

//     getAllUsers: (callback) => {
//         handleConnection.query("SELECT * FROM profiles", (error, results) => {
//             if (error) return callback(error);
//             callback(null, results);
//         })
//     },

//     getUserById: (userId, callback) => {
//         handleConnection.query("SELECT * FROM profiles WHERE id = ?", [userId], (error, results) => {
//             if (error) return callback(error);
//             callback(null, results[0]);
//         })
//     },

//     createUser: async (userData, callback) => {
//         console.log('userData model: ', userData);
//         try {

//             const { name, email, password } = userData;
//             console.log('name: ', name);
//             console.log('email: ', email);
//             console.log('password: ', password);

//             const hashedPassword = await bcrypt.hash(password, 10);
//             console.log('hashedPassword: ', hashedPassword);

//             const sql = "INSERT INTO profiles (name, email, password) VALUES (?, ?, ?)";

//             handleConnection.query(sql, [name, email, hashedPassword], (error, result) => {
//                 console.log('result in model: ', result);
//                 if (error) return callback(error);
//                 callback(null, { id: result.insertId, name, email });
//             });
//         }
//         catch (error) {
//             console.log('error in createUser: ', error);
//             callback(error);
//         }
//     },

//     updateUser: (userData, callback) => {
//         console.log('userData in db.js --> ', userData);

//         const { id, name, email } = userData;

//         const sql = `UPDATE profiles SET name = ?, email = ? WHERE id = ?`;

//         handleConnection.query(sql, [name, email, id], (error, result) => {
//             console.log('result: ', result);

//             if (error) return callback(error);

//             if (result.affectedRows === 0) {
//                 return callback(null, null);
//             }

//             callback(null, { id, name, email });
//         })
//     },

//     deleteUser: (userId, callback) => {
//         console.log("userId in delete in db.js", userId);

//         const sql = `DELETE FROM profiles WHERE id = ?`;

//         handleConnection.query(sql, [userId], (error, result) => {
//             console.log('result: ', result);
//             if (error) return callback(error);

//             if (result.affectedRows === 0) {
//                 return callback(null, null);
//             }

//             callback(null, result);
//         })
//     },

//     patchUpdateUser: (userData, callback) => {
//         console.log('userData: ', userData);

//         const { id, name, email } = userData;

//         const fields = [];
//         const values = [];

//         if (name !== undefined) {
//             fields.push("name = ?");
//             values.push(name);
//         }

//         if (email !== undefined) {
//             fields.push("email = ?");
//             values.push(email);
//         }

//         if (fields.length === 0) {
//             return callback(null, null);
//         }

//         const sql = `UPDATE profiles SET ${fields.join(", ")} WHERE id = ?`;
//         values.push(id);

//         handleConnection.query(sql, values, (err, profile) => {
//             if (err) return callback(err);

//             if (profile.affectedRows === 0) {
//                 return callback(null, null);
//             }

//             callback(null, profile);
//         });
//     }
// }

// module.exports = user;