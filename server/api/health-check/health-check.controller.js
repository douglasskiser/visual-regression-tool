var HealthCheck = require('./health-check.model'),
    errors = require('../../components/errors/errors');

exports.get = function(req, res) {
    HealthCheck.find(function(err, healthChecks) {
        if (err) {
            return  errors.handleResponseError(res, 500, err);
        }
        return res.json(healthChecks);
    });
};