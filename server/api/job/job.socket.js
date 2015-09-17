var Job = require('./job.model'),
    _ = require('underscore'),
    logger = require('../../components/logger/logger'),
    errors = require('../../components/errors/errors');

module.exports = function(app) {
    return {
        read: function(req) {
            console.log('hello read');
            if (req.data && req.data._id && req.data._id.length) {
                Job.findById(req.data._id, function(err, job) {
                    if (err) {
                        return errors.handleSocketError(req, err);
                    }
                    
                    return req.io.emit('data:job:read', job);
                });
            } else {
                Job.find(function(err, jobs) {
                    if (err) {
                        return errors.handleResponseError(req, err);
                    } 
                    
                    return req.io.emit('data:job:read', jobs);
                });
            }
        },
        create: function(req) {
            Job.create(req.data, function(err, job) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                return req.io.emit('data:job:create', job);
            });
        },
        update: function(req) {
            Job.findById(req.data._id, function(err, job) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                _.extend(job, req.data);
                
                job.save(function(err, updatedJob) {
                    if (err) {
                        return errors.handleSocketError(req, err);
                    }
                    return req.io.emit('data:job:update', updatedJob);
                });
            });
        },
        delete: function(req) {
            Job.findByIdAndRemove(req.data._id, function(err) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                return req.io.emit('data:job:delete', req.data._id);
            });
        }
    };
};