var Job = require('./job.model'),
    errors = require('../../components/errors/errors');

exports.get = function(req, res) {
    Job.find(function(err, jobs) {
        if (err) {
            return errors.handleResponseError(res, 500, err);
        }
        return res.json(jobs);
    });
};