var JobType = require('./job-type.model'),
    errors = require('../../components/errors/errors');

module.exports = function(app) {
    return {
        get: function(req) {
            JobType.find(function(err, jobTypes) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                return req.io.emit('data:jobTypes', jobTypes);
            });
        } 
    };
};