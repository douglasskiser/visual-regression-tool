var fs = require('fs'),
    B = require('bluebird'),
    Agenda = require('agenda'),
    env = process.env.NODE_ENV || 'development',
    config = require('../../config/config')[env],
    logger = require('../logger/logger'),
    Worker = require('webworker-threads').Worker,
    odm = require('../odm/odm'),
    executionCtrl = require('../../api/execution/execution.controller');
    
var AgendaService = (function() {
    function AgendaService(socket) {
        this.socket = socket;
    }

    AgendaService.prototype.failGracefully = function() {
        if (this.agenda) {
            this.agenda.stop(function() {
            process.exit(0);
          });
        }
    };
    
    AgendaService.prototype.start = function() {
        var self = this;

        this.agenda = new Agenda({
            db: {
                address: config.mongo.uri
            },
            name: 'execution queue',
            processEvery: '5 seconds'
        });
        
        // this.agenda.purge(function(err, numRemoved) {
        //     logger.info(numRemoved);
        // });
        
        this.agenda.define('checkExecutionQueue', function(job, done) {
          logger.info('checking execution queue');
          executionCtrl.checkExecutionQueue(self.socket, function(excs) {
              logger.info('found ' + excs.length + ' running...');
              done();
          });
        });
        
        this.agenda.every('5 seconds', 'checkExecutionQueue');
        
        process.on('SIGTERM', this.failGracefully);
        process.on('SIGINT' , this.failGracefully);
        
        //var jobs = ['visual-regression', 'health-check'];
        
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
        
        this.agenda.start();
        logger.info('Agenda started');
    };
    
    return AgendaService;
})();

module.exports = AgendaService;