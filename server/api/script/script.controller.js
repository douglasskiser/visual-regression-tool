var Script = require('./script.model'),
    env = process.env.NODE_ENV || 'development',
    config = require('../../config/config')[env],
    path = require('path'),
    fs = require('fs'),
    _ = require('underscore'),
    errors = require('../../components/errors/errors');

var _methods = {
    getAbsolutePath: function(model) {
        console.log('get abs path for model');
        console.log(path.join(config.rootPath, 'data', 'scripts', model._id + '.js'));
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
            return errors.handleResponseError(res, 500, err);
        }
        return res.json(scripts);
    });
};

exports.getOne = function(req, res) {
    Script.findById(req.params.id, function(err, script) {
        if (err) {
            return errors.handleResponseError(res, 500, err);
        }
        
        return res.json(script);
    });
};

exports.create = function(req, res) {
    Script.create(req.body, function(err, script) {
        if (err) {
            return errors.handleResponseError(res, 500, err);
        }
        fs.writeFile(path.normalize(__dirname + '/../../../data/scripts/' + script._id + '.js'), script.code, function() {
            return res.json(script);
        });
    });
};

exports.update = function(req, res) {
    Script.findById(req.params.id, function(err, script) {
        if (err) {
            return errors.handleResponseError(res, 500, err);
        }
        _.extend(script, req.body);
        
        script.save(function(err, updatedBox) {
            if (err) {
                return errors.handleResponseError(res, 500, err);
            }
            fs.writeFile(path.normalize(__dirname + '/../../../data/scripts/' + req.params._id + '.js'), updatedBox.code, function() {
                return res.json(updatedBox);
            });
        });
    });
};

exports.delete = function(req, res) {
    Script.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            return errors.handleResponseError(res, 500, err);
        }
        return res.send(204);
    });
};

exports.methods = _methods;