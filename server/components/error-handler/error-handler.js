var logger = require('../logger/logger');

module.exports = function(err) {
    return logger.info(err); // needs to be changed from info to some kind or error
};