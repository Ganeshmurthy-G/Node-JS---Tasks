const { loginUser } = require('../services/authService');

async function login(req, res, next) {
    const { email, password } = req.body;

    try {
        const { user, token } = await loginUser(email, password);

        // Set token in cookie
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000,
            sameSite: 'Lax',
        });

        res.status(200).json({ message: 'Logged in successfully', user: { id: user.id, email: user.email } });
    } catch (err) {
        next(err);
    }
}

module.exports = { login };
