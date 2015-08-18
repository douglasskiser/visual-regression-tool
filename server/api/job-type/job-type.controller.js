var JobType = require('./job-type.model');

exports.get = function(req, res) {
    JobType.find(function(err, jobTypes) {
        if (err) {
            return res.send(500, err);
        }
        return res.json(jobTypes);
    });
};