var HealthCheck = require('./health-check.model'),
    _ = require('underscore'),
    errors = require('../../components/errors/errors');

module.exports = function(app) {
    return {
        read: function(req) {
            if (req.data && req.data._id && req.data._id.length) {
                HealthCheck.findById(req.data._id, function(err, healthCheck) {
                    if (err) {
                        return errors.handleSocketError(req, err);
                    }
                    return req.io.emit('data:health-check:read', healthCheck);
                });
            } else {
                HealthCheck.find(function(err, healthChecks) {
                    if (err) {
                        return errors.handleSocketError(req, err);
                    }
                    return req.io.emit('data:health-check:read', healthChecks);
                });
            }
        },
        create: function(req) {
            HealthCheck.create(req.data, function(err, healthCheck) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                return req.io.emit('data:health-check:create', healthCheck);
            });
        },
        update: function(req) {
            HealthCheck.findById(req.data._id, function(err, healthCheck) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                _.extend(healthCheck, req.data);
                
                healthCheck.save(function(err, updatedHealthCheck) {
                    if (err) {
                        return errors.handleSocketError(req, err);
                    }
                    return req.io.emit('data:health-check:update', updatedHealthCheck);
                });
            });
        },
        delete: function(req) {
            HealthCheck.findByIdAndRemove(req.data._id, function(err) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                return req.io.emit('data:health-check:delete', req.data._id);
            });
        }
    };
};