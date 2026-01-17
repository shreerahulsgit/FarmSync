const express = require('express');
const bcrypt = require('bcrypt');
const user_data = require('../../models/user-data');
const router = express.Router();

const generate_uid = (desired_length) => {
    const prefix = "01";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let random_part = Array.from({ length: desired_length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
    return prefix + random_part;
};

router.post('/api/signup', async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;
        if (!lastname || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields.' });
        }

        const existing_user = await user_data.findOne({ email });
        if (existing_user) {
            return res.status(400).json({ message: 'Username or email is already registered.' });
        }

        const hashed_password = await bcrypt.hash(password, 10);
        const custom_uid = generate_uid(23); const channel_uid = generate_uid(18);

        const new_user = new user_data({
            uid: custom_uid, name: firstname + ' ' + lastname, email: email,
            password: hashed_password, channel: channel_uid
        });
        await new_user.save();

        res.status(201).json({ message: 'Registration successful, Please log in.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Unexpected error occurred, try again.' });
    }
});

router.post('/api/login', async (req, res) => {
    const { email, password, rememberme} = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        const user = await user_data.findOne({ email :email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials entered, try again.' });
        }

        const pass_authenticated = await bcrypt.compare(password, user.password);
        if (!pass_authenticated) {
            return res.status(400).json({ message: 'Invalid credentials entered, try again.' });
        }

        req.session.uid = user.uid;
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).json({ message: 'Error saving session, try again.' });
            }
            res.status(200).json({ message: 'You have successfully logged in.' });
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'An unexpected error occurred, try again.' });
    }
});

router.get('/logout', async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Session destroy error:', err);
            return res.status(500).json({ message: 'Error destroying session, try again.' });
        }
        res.redirect('/');
    }); 
});

module.exports = router;