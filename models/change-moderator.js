var Super = require('./base'),
    _ = require('underscore'),
    _s = require('underscore.string'),
    env = process.env.NODE_ENV || 'development',
    config = require('../config')[env],
    B = require('bluebird'),
    logger = require('../logger'),
    path = require('path'),
    nexpect = require('nexpect'),
    glob = require("glob"),
    Model = Super.extend({
        tableName: 'ChangeModerator'
    });


Model.prototype.script = function() {
    var Other = require('./script');
    return this.belongsTo(Other, 'scriptId');
};

Model.prototype.box = function() {
    var Other = require('./box');
    return this.belongsTo(Other, 'boxId');
};

Model.prototype.device = function() {
    var Other = require('./device');
    return this.belongsTo(Other, 'deviceId');
};

module.exports = Model;
