var HealthCheck = require('./health-check.model'),
    errors = require('../../components/errors/errors');

module.exports = function(app) {
    return {
        get: function(req) {
            HealthCheck.find(function(err, healthChecks) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                return req.io.emit('data:healthChecks', healthChecks);
            });
        } 
    };
};