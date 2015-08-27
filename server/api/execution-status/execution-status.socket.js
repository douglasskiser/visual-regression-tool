var ExecutionStatus = require('./execution-status.model'),
    _ = require('underscore'),
    errors = require('../../components/errors/errors');

module.exports = function(app) {
    return {
        get: function(req) {
            ExecutionStatus.find(function(err, statuses) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                return req.io.emit('data:executionStatuses', statuses);
            });
        }
    };
};