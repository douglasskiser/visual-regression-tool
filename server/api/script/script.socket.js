var Script = require('./script.model'),
    errors = require('../../components/errors/errors');

module.exports = function(app) {
    return {
        get: function(req) {
            Script.find(function(err, scripts) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                return req.io.emit('data:scripts', scripts);
            });
        } 
    };
};