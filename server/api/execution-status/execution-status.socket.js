var ExecutionStatus = require('./execution-status.model'),
    _ = require('underscore'),
    errors = require('../../components/errors/errors');

module.exports = function(app) {
    return {
        read: function(req) {
            if (req.data && req.data._id && req.data._id.length) {
                ExecutionStatus.findById(req.data._id, function(err, status) {
                    if (err) {
                        return errors.handleSocketError(req, err);
                    }
                    return req.io.emit('data:execution-status:read', status);
                });
            } else {
                ExecutionStatus.find(function(err, status) {
                    if (err) {
                        return errors.handleSocketError(req, err);
                    }
                    return req.io.emit('data:execution-status:read', status);
                });
            }
        }
    };
};