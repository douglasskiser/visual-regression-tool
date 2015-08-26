var JobType = require('./job-type.model'),
    _ = require('underscore'),
    errors = require('../../components/errors/errors');

module.exports = function(app) {
    return {
        get: function(req) {
            JobType.find(function(err, jobTypes) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                return req.io.emit('data:jobTypes', jobTypes);
            });
        },
        getOne: function(req, data) {
            JobType.findById(data.id, function(err, jobType) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                return req.io.emit('data:jobTypes', jobType);
            });
        },
        create: function(req, data) {
            JobType.create(data, function(err, jobType) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                return req.io.emit('data:jobTypes:created', jobType);
            });
        },
        update: function(req, data) {
            JobType.findById(data.id, function(err, jobType) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                _.extend(jobType, data);
                
                jobType.save(function(err, updatedJobType) {
                    if (err) {
                        return errors.handleSocketError(req, err);
                    }
                    return req.io.emit('data:jobTypes:updated', updatedJobType);
                });
            });
        },
        delete: function(req, data) {
            JobType.findByIdAndRemove(data.id, function(err) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                return req.io.emit('data:jobTypes:deleted', data._id);
            });
        }
    };
};