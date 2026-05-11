const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { users } = require('../data/users');

exports.register = async (req, res) => {

    const { email, password } = req.body;

    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
        return res.status(400).json({
            message: 'User already exists'
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
        id: Date.now(),
        email,
        password: hashedPassword
    };

    users.push(user);

    res.json({
        message: 'Registered successfully'
    });
};

exports.login = async (req, res) => {

    const { email, password } = req.body;

    const user = users.find(u => u.email === email);

    if (!user) {
        return res.status(400).json({
            message: 'Invalid credentials'
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).json({
            message: 'Invalid credentials'
        });
    }

    const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    res.json({
        token,
        user: {
            id: user.id,
            email: user.email
        }
    });
};