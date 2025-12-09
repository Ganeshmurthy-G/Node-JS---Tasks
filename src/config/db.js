const dotenv = require('dotenv');
const mysql = require('mysql2');

dotenv.config();

const handleConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
// console.log('handleConnection: ', handleConnection);

handleConnection.connect((err)=>{
    if (err) {
        console.log("MYSQL Database is not Connected");
    }else{
        console.log("MYSQL Database is Connected");
    }
});

module.exports=handleConnection;