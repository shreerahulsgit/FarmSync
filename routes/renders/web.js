const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    res.render('home');
});


router.get('/signup', (req, res) => {
    res.render('signup');
});


router.get('/login', (req, res) => {
    if (req.session.uid) {
        return res.redirect('/dashboard');
    }
    res.render('signin');
});

router.get('/dashboard', (req, res) => {
    if (!req.session.uid) {
        return res.redirect('/login');
    }
    res.render('dashboard');

});
router.get('/weather', (req, res) => {
    res.render('weather');

});

router.get('/crop', (req, res) => {
    res.render('crop');

});

router.get('/coming_soon', (req, res) => {
    res.render('coming_soon');

});

router.get('/gov', (req, res) => {
    res.render('gov');

});

router.get('/agri_bot', (req, res) => {
    res.render('agri_bot');

});

module.exports = router;