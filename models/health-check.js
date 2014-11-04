var Super = require('./base'),
    _ = require('underscore'),
    _s = require('underscore.string'),
    env = process.env.NODE_ENV || 'development',
    config = require('../config')[env],
    B = require('bluebird'),
    logger = require('../logger'),
    fs = require('fs'),
    path = require('path'),
    Model = Super.extend({
        tableName: 'HealthCheck'
    });

Model.getScriptAbsPath = function(model) {
    return path.join(config.rootPath, 'background', 'health-check', 'scripts', model.id + '.js');
};


Model.prototype.format = function(attrs) {
    var that = this;
    if (that.hasChanged('script') && !_.isEmpty(attrs['script'])) {
        //write the script to the file
        fs.writeFile(that.getScriptAbsPath(), attrs['script'], function(err) {
            if (err) throw err;
        });
    }
    return attrs;
};

Model.prototype.getScriptAbsPath = function(){
    return Model.getScriptAbsPath(this);
};

module.exports = Model;
