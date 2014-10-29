var path = require('path'),
    env = process.env.NODE_ENV || 'development',
    _ = require('underscore'),
    _s = require('underscore.string'),
    config = require('../config')[env],
    B = require('bluebird'),
    pkg = require('../package.json'),
    logger = require('../logger'),
    minimist = require('minimist'),
    Screenshot = require('../models/screenshot');
    

var argv = require('minimist')(process.argv.slice(2));

switch(argv.command){
    case 'screenshot':
        (function(){
            var screenshot = new Screenshot({
                executionId: argv.executionId,
                fileName: argv.fileName,
                name: decodeURIComponent(argv.name)
            });
            screenshot.save();
        })();
        break;

}