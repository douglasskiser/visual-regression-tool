var HealthCheck = require('./health-check.model'),
    _ = require('underscore'),
    errors = require('../../components/errors/errors');

exports.get = function(req, res) {
    HealthCheck.find(function(err, healthChecks) {
        if (err) {
            return  errors.handleResponseError(res, 500, err);
        }
        return res.json(healthChecks);
    });
};

exports.getOne = function(req, res) {
    HealthCheck.findOne({id: req.params.id}, function(err, healthCheck) { //HealthCheck.findById(req.params.id, function(err, healthCheck) {
        if (err) {
            return errors.handleResponseError(res, 500, err);
        }
        return res.json(healthCheck);
    });
};

exports.create = function(req, res) {
    HealthCheck.create(req.body, function(err, healthCheck) {
        if (err) {
            return errors.handleResponseError(res, 500, err);
        }
        return res.json(healthCheck);
    });
};

exports.update = function(req, res) {
    HealthCheck.findById(req.params.id, function(err, healthCheck) {
        if (err) {
            return errors.handleResponseError(res, 500, err);
        }
        _.extend(healthCheck, req.body);
        
        healthCheck.save(function(err, updatedHealthCheck) {
            if (err) {
                return errors.handleResponseError(res, 500, err);
            }
            return res.json(updatedHealthCheck);
        });
    });
};

exports.delete = function(req, res) {
    HealthCheck.findByIdAndRemove(req.params.id, function(err, healthCheck) {
        if (err) {
            return errors.handleResponseError(res, 500, err);
        }
        return res.send(204);
    });
};