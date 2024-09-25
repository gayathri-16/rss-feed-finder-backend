const express = require('express');
const router = express.Router();
const { fetchAndCategorize,greetMsg } = require('./apiFetchingController');
router.post('/api', fetchAndCategorize);
router.get('/', greetMsg);


module.exports = router;


