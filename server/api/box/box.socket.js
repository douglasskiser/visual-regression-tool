var Box = require('./box.model'),
    errors = require('../../components/errors/errors');

module.exports = function(app) {
    return {
        get: function(req) {
            Box.find(function(err, boxes) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                return req.io.emit('data:boxes', boxes);
            });
        } 
    };
};