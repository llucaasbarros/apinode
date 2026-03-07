const jwt = require('jsonwebtoken');

function login(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'username e password são obrigatórios.' });
    }

    if (username !== process.env.JWT_USER || password !== process.env.JWT_PASSWORD) {
        return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return res.status(200).json({ token });
}

module.exports = { login };
