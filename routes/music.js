const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
    res.send('in the music index route');
});

module.exports = router;