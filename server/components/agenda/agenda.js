var fs = require('fs'),
    _ = require('underscore'),
    B = require('bluebird'),
    Agenda = require('agenda'),
    env = process.env.NODE_ENV || 'development',
    config = require('../../config/config')[env],
    logger = require('../logger/logger'),
    Worker = require('webworker-threads').Worker,
    odm = require('../odm/odm'),
    executionCtrl = require('../../api/execution/execution.controller');

var AgendaService = (function() {
    function AgendaService(socket, ops) {
        var that = this;
        
        this.socket = socket;
        this.ops = _.extend({
            listeners: {
                start: function(job) {
                    logger.info('New job is starting...');
                },
                complete: function(job) {
                    logger.info('Job is complete...');
                },
                fail: function(job) {
                    logger.info('Job failed...');
                }
            },
            processEvery: '5 seconds'
        }, ops || {});

        this.agenda = new Agenda({
            db: {
                address: config.mongo.uri
            },
            processEvery: '5 seconds'
        });

        this.agenda.define('runExecution', function(job, done) {
            logger.info('running execution');

            executionCtrl.run(job.attrs.data.id, that.socket, function() {
                done();
            });

            this.agenda.on('start', this.ops.listeners.start);
            this.agenda.on('complete', this.ops.listeners.complete);
            this.agenda.on('fail', this.ops.listeners.fail);
        });
    }

    AgendaService.prototype.failGracefully = function() {
        if (this.agenda) {
            this.agenda.stop(function() {
                process.exit(0);
            });
        }
    };

    AgendaService.prototype.create = function(data) {
        logger.info('adding execution to agenda');

        var job = this.agenda.create('runExecution', {
            id: data._id
        });
        job.save(function(err) {
            if (!err) {
                logger.info('job saved successfully');
            }
        });
        this.agenda.now('runExecution');
    };

    AgendaService.prototype.purge = function() {
        this.agenda.purge(function(err, numRemoved) {
            var msg = numRemoved === 1 ? ' item were purged from the agenda.' : ' items were purged from the agenda.';
            if (err) {
                logger.info('Error: purging agenda.');
            }
            logger.info(numRemoved + msg);
        });
    };

    AgendaService.prototype.start = function() {
        process.on('SIGTERM', this.failGracefully);
        process.on('SIGINT', this.failGracefully);

        this.agenda.start();
        logger.info('Agenda started');
    };

    return AgendaService;
})();

module.exports = AgendaService;
