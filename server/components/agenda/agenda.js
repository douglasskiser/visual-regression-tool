var fs = require('fs'),
    B = require('bluebird'),
    Agenda = require('agenda'),
    env = process.env.NODE_ENV || 'development',
    config = require('../../config/config')[env],
    logger = require('../logger/logger'),
    Worker = require('webworker-threads').Worker,
    odm = require('../odm/odm'),
    executionCtrl = require('../../api/execution/execution.controller');
    


module.exports = function(socket) {
    var agenda = new Agenda({
        db: {
            address: config.mongo.uri
        },
        name: 'execution queue',
        processEvery: '5 seconds'
    });
    
    // agenda.purge(function(err, numRemoved) {
    //     logger.info(numRemoved);
    // });
    
    agenda.define('checkExecutionQueue', function(job, done) {
      logger.info('checking execution queue');
      executionCtrl.checkExecutionQueue(socket, function(excs) {
          logger.info('found ' + excs.length + ' running...');
      });
      done();
    });
    
    agenda.every('5 seconds', 'checkExecutionQueue');
    
    // stop processes gracefully so they can restart later
    function graceful() {
      agenda.stop(function() {
        process.exit(0);
      });
    }
    
    process.on('SIGTERM', graceful);
    process.on('SIGINT' , graceful);
    
    var jobs = ['visual-regression', 'health-check'];
    
    // jobs.forEach(function(module) {
    //     // var modulePath = '../../jobs/' + module; // check this path later
        
    //     // fs.exists(modulePath, function(exists) {
    //     //     if (exists) {
    //     //         require(modulePath);
    //     //     }
    //     // });
    // });
    
    // if (jobs.length) {
    //     B.all([odm.initialize()])
    //         .then(function() {
    //             return;
    //         });
    // }
    
    return agenda;
};