var Job = require('./job.model'),
    _ = require('underscore'),
    errors = require('../../components/errors/errors');

exports.get = function(req, res) {
    Job.find(function(err, jobs) {
        if (err) {
            return errors.handleResponseError(res, 500, err);
        }
        return res.json(jobs);
    });
};

exports.getOne = function(req, res) {
    Job.findById(req.params.id, function(err, Job) {
        if (err) {
            return errors.handleResponseError(res, 500, err);
        }
        return res.json(Job);
    });
};

exports.create = function(req, res) {
    Job.create(req.body, function(err, Job) {
        if (err) {
            return errors.handleResponseError(res, 500, err);
        }
        return res.json(Job);
    });
};

exports.update = function(req, res) {
    Job.findById(req.params.id, function(err, Job) {
        if (err) {
            return errors.handleResponseError(res, 500, err);
        }
        _.extend(Job, req.body);
        
        Job.save(function(err, updatedJob) {
            if (err) {
                return errors.handleResponseError(res, 500, err);
            }
            return res.json(updatedJob);
        });
    });
};

exports.delete = function(req, res) {
    Job.findByIdAndRemove(req.params.id, function(err, job) {
        if (err) {
            return errors.handleResponseError(res, 500, err);
        }
        return res.send(204);
    });
};