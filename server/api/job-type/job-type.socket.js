var JobType = require('./job-type.model'),
    _ = require('underscore'),
    errors = require('../../components/errors/errors');

module.exports = function(app) {
    return {
        read: function(req) {
            if (req.data && req.data._id && req.data._id.length) {
               JobType.findById(req.data._id, function(err, jobType) {
                    if (err) {
                        return errors.handleSocketError(req, err);
                    }
                    return req.io.emit('data:job-type:read', jobType);
                }); 
            } else {
                JobType.find(function(err, jobTypes) {
                    if (err) {
                        return errors.handleSocketError(req, err);
                    }
                    return req.io.emit('data:job-type:read', jobTypes);
                });
            }
        },
        create: function(req) {
            JobType.create(req.data, function(err, jobType) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                return req.io.emit('data:job-type:create', jobType);
            });
        },
        update: function(req) {
            JobType.findById(req.data._id, function(err, jobType) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                _.extend(jobType, req.data);
                
                jobType.save(function(err, updatedJobType) {
                    if (err) {
                        return errors.handleSocketError(req, err);
                    }
                    return req.io.emit('data:job-type:update', updatedJobType);
                });
            });
        },
        delete: function(req, data) {
            JobType.findByIdAndRemove(data.id, function(err) {
                if (err) {
                    return errors.handleSocketError(req, err);
                }
                return req.io.emit('data:job-type:delete', data._id);
            });
        }
    };
};