var Job = require('./job.model'),
    _ = require('underscore'),
    errors = require('../../components/errors/errors');

module.exports = function(app) {
    return {
        get: function(req) {
            Job.find(function(err, jobs) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                return req.io.emit('data:jobs', jobs);
            });
        },
        getOne: function(req, data) {
            Job.findById(data.id, function(err, job) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                return req.io.emit('data:jobs', job);
            });
        },
        create: function(req, data) {
            Job.create(data, function(err, job) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                return req.io.emit('data:jobs:created', job);
            });
        },
        update: function(req, data) {
            Job.findById(data.id, function(err, job) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                _.extend(job, data);
                
                job.save(function(err, updatedJob) {
                    if (err) {
                        return errors.handleSocketError(req, err);
                    }
                    return req.io.emit('data:jobs:updated', updatedJob);
                });
            });
        },
        delete: function(req, data) {
            Job.findByIdAndRemove(data.id, function(err) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                return req.io.emit('data:jobs:deleted', data._id);
            });
        }
    };
};