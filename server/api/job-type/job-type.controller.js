var JobType = require('./job-type.model'),
    errors = require('../../components/errors/errors');

exports.get = function(req, res) {
    JobType.find(function(err, jobTypes) {
        if (err) {
            return errors.handleResponseError(res, 500, err);
        }
        return res.json(jobTypes);
    });
};