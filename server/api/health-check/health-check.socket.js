var HealthCheck = require('./health-check.model');

module.exports = function(app) {
    return {
        get: function(req) {
            HealthCheck.find(function(err, healthChecks) {
                if (err) {
                    //handle err
                }
                return req.io.emit('data:healthChecks', healthChecks);
            });
        } 
    };
};