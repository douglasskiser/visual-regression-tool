var Box = require('./box.model');

exports.get = function(req, res) {
    Box.find(function(err, boxes) {
        if (err) {
            return res.send(500, err);
        }
        return res.json(boxes);
    });
};

exports.getOne = function(req, res) {
    Box.findById(req.params.id, function(err, box) {
        if (err) {
            return res.send(500, err);
        }
        return res.json(box);
    });
};