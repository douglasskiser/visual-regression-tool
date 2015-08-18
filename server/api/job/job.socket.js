var Job = require('./job.model');

module.exports = function(app) {
    return {
        get: function(req) {
            Job.find(function(err, jobs) {
                if (err) {
                    //handle err
                }
                return req.io.emit('data:jobs', jobs);
            });
        } 
    };
};