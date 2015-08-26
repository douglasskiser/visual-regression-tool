var Box = require('./box.model'),
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
    Box.findById(req.params.id, function(err, box) {
        if (err) {
            return errors.handleResponseError(res, 500, err);
        }
        return res.json(box);
    });
};