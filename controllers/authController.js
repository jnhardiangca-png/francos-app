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
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password required'
            });
        }

        const user = users.find(u => u.email === email);

        // SAFE CHECK FIRST (IMPORTANT)
        if (!user) {
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }

        if (!user.password) {
            return res.status(500).json({
                message: 'User data corrupted'
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

        return res.json({
            token,
            user: {
                id: user.id,
                email: user.email
            }
        });

    } catch (err) {
        console.error("LOGIN ERROR:", err);

        return res.status(500).json({
            message: 'Server error'
        });
    }
};