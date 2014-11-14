var Super = require('./base'),
    _ = require('underscore'),
    _s = require('underscore.string'),
    env = process.env.NODE_ENV || 'development',
    config = require('../config')[env],
    B = require('bluebird'),
    fs = require('fs'),
    logger = require('../logger'),
    path = require('path'),
    Model = Super.extend({
        tableName: 'Script'
    });

Model.prototype.initialize = function(attributes, options) {
    this.on('saved', this.onSavedHandler.bind(this));
};

Model.prototype.onSavedHandler = function(model, attrs, options) {
    var that = this;
    if (model.get('code')) {
        //write the script to the file
        fs.writeFile(that.getAbsolutePath(), model.get('code'), function(err) {
            if (err) throw err;
        });
    }
};

Model.prototype.getAbsolutePath = function() {
    return Model.getAbsolutePath(this);
};

Model.getAbsolutePath = function(model) {
    return path.join(config.rootPath, 'data', 'scripts', model.id + '.js');
};


module.exports = Model;
