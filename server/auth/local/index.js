var passport = require('passport');
var auth = require('../auth.service');

module.exports = function(app) {
    app.post('/auth/local', function(req, res, next) {
      console.log('bout to authenticate passport');
        
      passport.authenticate('local', function (err, user, info) {
        var error = err || info;
        if (error) {
            return res.json(401, error);
        }
        if (!user) {
            return res.json(404, {message: 'Something went wrong, please try again.'});
        }
    
        var token = auth.signToken(user._id, user.role);
        res.json({token: token});
      })(req, res, next);
    });
};