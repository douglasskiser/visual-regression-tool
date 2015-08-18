var Job = require('./job.model');

exports.get = function(req, res) {
    Job.find(function(err, jobs) {
        if (err) {
            return res.send(500, err);
        }
        return res.json(jobs);
    });
};