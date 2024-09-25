const express = require('express');
const router = express.Router();
const { fetchAndCategorize } = require('../controller/apiFetchingController');

router.post('/api', fetchAndCategorize);

module.exports = router;


