var fs = require('fs'),
    B = require('bluebird'),
    Agenda = require('agenda'),
    env = process.env.NODE_ENV || 'development',
    config = require('../../config/config')[env],
    logger = require('../logger/logger'),
    odm = require('../odm/odm'),
    executionCtrl = require('../../api/execution/execution.controller');
    
var agenda = new Agenda({
    db: {
        address: config.mongo.uri,
        collection: 'jobs'
    }
});

agenda.define('check execution queue', function(job, done) {
    executionCtrl.checkExecutionQueue();
});

agenda.every('5 seconds', 'check execution queue');

var jobs = ['visual-regression', 'health-check'];

jobs.forEach(function(module) {
    var modulePath = '../../jobs/' + module; // check this path later
    
    fs.exists(modulePath, function(exists) {
        if (exists) {
            require(modulePath);
        }
    });
});

// if (jobs.length) {
//     B.all([odm.initialize()])
//         .then(function() {
//             logger.infoAsync('Agenda started.');
//             //agenda.start();
//             // instead of starting, export unstarted agenda with definitions then start in bg worker
//         });
// }

module.exports = agenda;