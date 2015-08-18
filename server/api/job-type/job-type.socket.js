var JobType = require('./job-type.model');

module.exports = function(app) {
    return {
        get: function(req) {
            JobType.find(function(err, jobTypes) {
                if (err) {
                    //handle err
                }
                return req.io.emit('data:jobTypes', jobTypes);
            });
        } 
    };
};