var HealthCheck = require('./health-check.model');

exports.get = function(req, res) {
    HealthCheck.find(function(err, healthChecks) {
        if (err) {
            return res.send(500, err);
        }
        return res.json(healthChecks);
    });
};