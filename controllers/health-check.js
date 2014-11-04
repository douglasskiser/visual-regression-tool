var db = require('../db'),
    env = process.env.NODE_ENV || 'development',
    config = require('../config')[env],
    B = require('bluebird'),
    logger = require('../logger'),
    _ = require('underscore'),
    utils = require('../utils'),
    fs = require('fs'),
    _s = require('underscore.string');


exports.template = function(req, res, next) {
    res.status(200).type('text/plain').sendfile('./background/health-check/template.js');
};
