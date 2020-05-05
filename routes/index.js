const express = require('express');
const router = express.Router();
const connectEnsureLogin = require('connect-ensure-login');


router.get('/', (req, res) => 
    res.render('main/index',));



router.get('/home', 
    (req, res) => res.render('main/index',
    
    ));


module.exports = router;
