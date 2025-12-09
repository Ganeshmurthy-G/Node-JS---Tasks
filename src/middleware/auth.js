const jwt = require('jsonwebtoken');
const environment=require('dotenv');

environment.config();

const JWT_SECRET = process.env.JWT_SECRET;
console.log('JWT_SECRET in auth : ', JWT_SECRET);

const verifyToken = (req, res, next) => {
    // const authHeader = req.headers['authorization'];
    // console.log('authHeader: ', authHeader);

    // if (!authHeader) {
    //     return res.status(401).json({ message: 'No token available' });
    // }

    // // const token = authHeader.split(' ')[1];
    
    const token = req.cookies.jwt;
    console.log('token in authjs : ', token);

    if (!token) {
        return res.status(401).json({ message: 'Token format invalid' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Failed to authenticate token' });
        }
        req.user = decoded; 
        console.log('decoded: ', decoded);
        next();
    });
};

module.exports = verifyToken;