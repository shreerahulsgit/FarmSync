const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    if (req.session.uid) { return res.redirect('/dashboard'); }
    res.render('home');
});

router.get('/signup', (req, res) => {
    if (req.session.uid) { return res.redirect('/dashboard'); }
    res.render('signup');
});

router.get('/login', (req, res) => {
    if (req.session.uid) { return res.redirect('/dashboard'); }
    res.render('signin');
});

router.get('/dashboard', (req, res) => {
    if (!req.session.uid) { return res.redirect('/login'); }
    res.render('dashboard');
});

router.get('/weather', (req, res) => {
    res.render('weather');
});

router.get('/crop', (req, res) => {
    if (!req.session.uid) { return res.redirect('/login'); }
    res.render('crop');
});

router.get('/coming-soon', (req, res) => {
    if (!req.session.uid) { return res.redirect('/login'); }
    res.render('coming-soon');
});

router.get('/gov', (req, res) => {
    if (!req.session.uid) { return res.redirect('/login'); }
    res.render('gov');
});

router.get('/agri-bot', (req, res) => {
    if (!req.session.uid) { return res.redirect('/login'); }
    res.render('agri-bot');
});

module.exports = router;