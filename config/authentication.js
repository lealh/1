module.exports = {
    ensureAuthenticated: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg', 'Log in to view this');
        console.log('FAILING');
        res.redirect('/users/login');
    }
} 