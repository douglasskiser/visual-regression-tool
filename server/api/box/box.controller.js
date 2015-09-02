var Box = require('./box.model'),
    _ = require('underscore'),
    errors = require('../../components/errors/errors');

exports.get = function(req, res) {
    Box.find(function(err, boxes) {
        if (err) {
            return errors.handleResponseError(res, 500, err);
        }
        return res.json(boxes);
    });
};

exports.getOne = function(req, res) {
    Box.findOne({id: req.params.id}, function(err, box) { //Box.findById(req.params.id, function(err, box) {
        if (err) {
            return errors.handleResponseError(res, 500, err);
        }
        return res.json(box);
    });
};

exports.create = function(req, res) {
    Box.create(req.body, function(err, box) {
        if (err) {
            return errors.handleResponseError(res, 500, err);
        }
        return res.json(box);
    });
};

exports.update = function(req, res) {
    Box.findById(req.params.id, function(err, box) {
        if (err) {
            return errors.handleResponseError(res, 500, err);
        }
        _.extend(box, req.body);
        
        box.save(function(err, updatedBox) {
            if (err) {
                return errors.handleResponseError(res, 500, err);
            }
            return res.json(updatedBox);
        });
    });
};

exports.delete = function(req, res) {
    Box.findByIdAndRemove(req.params.id, function(err, box) {
        if (err) {
            return errors.handleResponseError(res, 500, err);
        }
        return res.send(204);
    });
};