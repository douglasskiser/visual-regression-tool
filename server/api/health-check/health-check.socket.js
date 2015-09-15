var HealthCheck = require('./health-check.model'),
    _ = require('underscore'),
    errors = require('../../components/errors/errors');

module.exports = function(app) {
    return {
        get: function(req) {
            HealthCheck.find(function(err, healthChecks) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                return req.io.emit('data:healthChecks', healthChecks);
            });
        },
        read: function(req) {
            HealthCheck.findById(req.data._id, function(err, healthCheck) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                return req.io.emit('data:health-check', healthCheck);
            });
        },
        create: function(req, data) {
            HealthCheck.create(data, function(err, healthCheck) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                return req.io.emit('data:healthChecks:created', healthCheck);
            });
        },
        update: function(req, data) {
            HealthCheck.findById(data.id, function(err, healthCheck) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                _.extend(healthCheck, data);
                
                healthCheck.save(function(err, updatedHealthCheck) {
                    if (err) {
                        return errors.handleSocketError(req, err);
                    }
                    return req.io.emit('data:healthChecks:updated', updatedHealthCheck);
                });
            });
        },
        delete: function(req, data) {
            HealthCheck.findByIdAndRemove(data.id, function(err) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                return req.io.emit('data:healthChecks:deleted', data._id);
            });
        }
    };
};