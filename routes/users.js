const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User')
const connectEnsureLogin = require('connect-ensure-login');

router.get('/register', (req, res) => res.render('register'));

router.post('/register', (req,res) => {
    const { name, email, password, confirmpassword } = req.body;
    let errors = [];

    if(!name || !email || !password || !confirmpassword) {
        errors.push({msg: 'Please fill in all fields'});

    }

    if(password !== confirmpassword) {
        errors.push({msg: 'Passwords do not match'});
    }

    if(password.length < 8){
        errors.push({msg: 'Password should be atleast 8 characters'});
    }

    if(errors.length > 0){
        res.render('register', {
            errors: errors,
            name: name,
            email: email,
            password: password,
            confirmpassword: confirmpassword
        });
    } else {
        User.findOne({email: email})
        .then(user =>{
            if (user){
                errors.push({msg: 'Email is already in use'});
                res.render('register',{
                errors,
                name,
                email,
                password,
                confirmpassword,
                });
            }else{
                const newUser = new User({
                    name,
                    email,
                    password,
                });

                bcrypt.genSalt(10, (err, salt) => 
                    bcrypt.hash(newUser.password, salt, (err, hash) =>{
                        if(err) throw err;
                        //Change Password to hash version
                        newUser.password = hash;
                        //Save the User
                        newUser.save()
                        .then(user => {
                            req.flash('success_msg', 'You are now connected and can log in')
                            res.redirect('/users/login');
                            return
                        })
                        .catch(err => console.log(err));

                }))
            }

        });
    }
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/foundItems',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
}); 

// router.post('/login', (req, res, next) => {
//     passport.authenticate('local',
//     (err, user) => {
//       if (err) {
//         return next(err);
//       }
  
//       if (!user) {
//         return res.redirect('/users/login');
//       }
  
//       req.logIn(user, function(err) {
//         if (err) {
//           return next(err);
//         }
  
//         return res.redirect('/home');
//       });
  
//     })(req, res, next);
//   });

router.get('/logout', (req, res, next) => {
    req.logout;
    req.flash('success_msg', 'You are logged out');
    res.redirect('users/login');
});

router.get('/login', (req, res) => res.render('login'));

module.exports = router;
