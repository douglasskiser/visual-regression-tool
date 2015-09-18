var env = process.env.NODE_ENV || 'development',
    config = require('../config/config')[env];
    
var passport = require('passport');
var User = require('../api/user/user.model');

require('./local/passport').setup(User, config)

module.exports = function(app) {
  require('./local')(app);    
};