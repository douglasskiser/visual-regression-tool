var JobType = require('./job-type.model'),
    _ = require('underscore'),
    errors = require('../../components/errors/errors');

exports.get = function(req, res) {
    JobType.find(function(err, jobTypes) {
        if (err) {
            return errors.handleResponseError(res, 500, err);
        }
        return res.json(jobTypes);
    });
};

exports.getOne = function(req, res) {
    JobType.findOne({id: req.params.id}, function(err, jobType) { //JobType.findById(req.params.id, function(err, jobType) {
        if (err) {
            return errors.handleResponseError(res, 500, err);
        }
        return res.json(jobType);
    });
};

exports.create = function(req, res) {
    JobType.create(req.body, function(err, jobType) {
        if (err) {
            return errors.handleResponseError(res, 500, err);
        }
        return res.json(jobType);
    });
};

exports.update = function(req, res) {
    JobType.findById(req.params.id, function(err, jobType) {
        if (err) {
            return errors.handleResponseError(res, 500, err);
        }
        _.extend(jobType, req.body);
        
        jobType.save(function(err, updatedJobType) {
            if (err) {
                return errors.handleResponseError(res, 500, err);
            }
            return res.json(updatedJobType);
        });
    });
};

exports.delete = function(req, res) {
    JobType.findByIdAndRemove(req.params.id, function(err, jobType) {
        if (err) {
            return errors.handleResponseError(res, 500, err);
        }
        return res.send(204);
    });
};