var Execution = require('./execution.model'),
    errors = require('../../components/errors/errors');

module.exports = function(app) {
    return {
        get: function(req) {
            Execution.find(function(err, excs) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                return req.io.emit('data:executions', excs);
            });
        } 
    };
};