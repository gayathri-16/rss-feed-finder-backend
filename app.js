const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}))
app.use((req,res,next)=>{
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next()
})

// Import routes
const apiRoutes = require('./api/api');
app.use('', apiRoutes);

module.exports = app;

