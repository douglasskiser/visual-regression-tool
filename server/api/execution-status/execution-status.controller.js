var ExecutionStatus = require('./execution-status.model'),
    _ = require('underscore'),
    errors = require('../../components/errors/errors');
    
exports.get = function(req, res) {
    ExecutionStatus.find(function(err, statuses) {
        if (err) {
            return errors.handleResponseError(res, 500, err);
        }
        return res.json(statuses);
    });
};