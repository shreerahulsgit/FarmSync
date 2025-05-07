const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const mongo_store = require('connect-mongo'); 
const auth_api = require('./routes/api/auth');
const crop_api = require('./routes/api/crop');
const bot_api = require('./routes/api/bot');
const web_renders = require('./routes/renders/web');
const http = require('http'); 
const path = require('path');

const app = express();
const server = http.createServer(app);  

const generate_session_id = () => {
    const prefix = "01";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let random_part = Array.from({ length: 28 }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
    return prefix + random_part;
};

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/sample')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb' }));
// Session Storage
app.use(session({
    secret: '91a3167d38f760d72af0ad296c108e287ae820b23413ad0b5ab0c210cda1ed0ec0951ebf8db202e964960af11adc6e3b97cab0e4e56f416770010addb16ae95f',
    resave: false,
    saveUninitialized: false,
    genid: generate_session_id,
    store: mongo_store.create({
        mongoUrl: 'mongodb://localhost:27017/sample',
        collectionName: 'sessions',
        autoRemove: 'interval',
        autoRemoveInterval: 720,
    }),
    cookie: {
        maxAge: 14 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'lax',
    }
}));

// Set view engine
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));

// Backend API Routes
app.use('/', auth_api);
app.use('/', web_renders);
app.use('/', crop_api);
app.use('/', bot_api);

// Start Server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});