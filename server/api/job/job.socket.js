var Job = require('./job.model'),
    errors = require('../../components/errors/errors');

module.exports = function(app) {
    return {
        get: function(req) {
            Job.find(function(err, jobs) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                return req.io.emit('data:jobs', jobs);
            });
        } 
    };
};