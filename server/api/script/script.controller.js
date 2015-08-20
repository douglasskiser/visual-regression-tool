var Script = require('./script.model'),
    config = require('../../config/config'),
    path = require('path'),
    fs = require('fs');

var _methods = {
    getAbsolutePath: function(model) {
        return path.join(config.rootPath, 'data', 'scripts', model._id + '.js');
    },
    writeScriptToFile: function(model) {
        if (model.code) {
            fs.writeFile(_methods.getAbsolutePath(model), model.code, function(err) {
                if (err) throw err;
            });
        }
    }
};

exports.get = function(req, res) {
    Script.find(function(err, scripts) {
        if (err) {
            return res.send(500, err);
        }
        return res.json(scripts);
    });
};