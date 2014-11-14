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
    ExecutionStatus = require('./execution-status'),
    JobType = require('./job-type'),
    Script = require('./script'),
    Box = require('./box'),
    Job = require('./job'),
    Device = require('./device'),
    Model = Super.extend({
        tableName: 'Execution',
        defaults: {
            statusId: ExecutionStatus.ID_SCHEDULED //0 - created, 10-running, 20-completed, 400 - error
        }
    });


Model.prototype.run = function() {
    var script, oldBox, newBox, device, that = this,
        job = new Job({
            id: that.get('jobId')
        });
    return job.fetch()
        .then(function() {
            oldBox = new Box({
                id: job.get('oldBoxId')
            });

            script = new Script({
                id: job.get('scriptId')
            });

            if (job.get('typeId') == JobType.ID_VISUAL_REGRESSION) {
                newBox = new Box({
                    id: job.get('newBoxId')
                });

                device = new Device({
                    id: job.get('deviceId')
                });

                return B.all([oldBox.fetch(), newBox.fetch(), script.fetch(), device.fetch()]);
            }
            else {
                return B.all([oldBox.fetch(), script.fetch()]);
            }

        })
        .then(function() {
            return that.save({
                statusId: ExecutionStatus.ID_RUNNING
            }, {
                patch: true
            });
        })
        .then(function() {
            var scriptAbsPath = script.getAbsolutePath();
            var executionBasePath = [config.rootPath, 'data', 'executions', that.id].join('/')
            var logPath = [executionBasePath, 'log.txt'].join('/');
            var url = oldBox.get('url');

            if (job.get('typeId') == JobType.ID_VISUAL_REGRESSION) {
                var screenshotsPath = [executionBasePath, 'screenshots'].join('/');
                var oldScreenshotsPath = [screenshotsPath, 'old'].join('/');
                var newScreenshotsPath = [screenshotsPath, 'new'].join('/');


                var newUrl = newBox.get('url');

                var oldCmd = [config.casper.absolutePath, scriptAbsPath, '--target=' + oldScreenshotsPath, '--url=' + url, '--width=' + device.get('width'), '--height=' + device.get('height'), ' > ', logPath].join(' ');
                var newCmd = [config.casper.absolutePath, scriptAbsPath, '--target=' + newScreenshotsPath, '--url=' + newUrl, '--width=' + device.get('width'), '--height=' + device.get('height'), ' > ', logPath].join(' ');

                return B.all([
                    (function() {
                        logger.info('start capturing the first URL. Command: ', oldCmd);

                        return new B(function(resolve, reject) {
                            nexpect.spawn(oldCmd)
                                .run(function(err, stdout, exitcode) {
                                    if (exitcode !== 0) {
                                        logger.error('error on first URL', stdout);
                                        reject({
                                            err: err,
                                            stdout: stdout,
                                            exitCode: exitcode
                                        });
                                        return;
                                    }
                                    logger.info('First URL completed', oldCmd);
                                    resolve({
                                        err: err,
                                        stdout: stdout,
                                        exitCode: exitcode
                                    });
                                });
                        });
                    })(),
                    (function() {
                        logger.info('start capturing the second URL. Command: ', newCmd);

                        return new B(function(resolve, reject) {
                            nexpect.spawn(newCmd)
                                .run(function(err, stdout, exitcode) {
                                    if (exitcode !== 0) {
                                        logger.error('error on second URL', stdout);
                                        reject({
                                            err: err,
                                            stdout: stdout,
                                            exitCode: exitcode
                                        });
                                        return;
                                    }
                                    logger.info('Second URL completed', oldCmd);
                                    resolve({
                                        err: err,
                                        stdout: stdout,
                                        exitCode: exitcode
                                    });
                                });
                        });
                    })()
                                ]);
            }
            else {
                return (function() {
                    var cmd = [config.casper.absolutePath, scriptAbsPath, '--url=' + url, ' > ', logPath].join(' ');
                    logger.info(cmd);

                    return new B(function(resolve, reject) {
                        nexpect.spawn(cmd)
                            .run(function(err, stdout, exitcode) {
                                if (exitcode !== 0) {
                                    reject({
                                        err: err,
                                        stdout: stdout,
                                        exitCode: exitcode
                                    });
                                    return;
                                }
                                resolve({
                                    err: err,
                                    stdout: stdout,
                                    exitCode: exitcode
                                });
                            });
                    });
                });
            }
        })
        .then(function() {
            return that.save({
                statusId: ExecutionStatus.ID_COMPLETED
            }, {
                patch: true
            });
        })
        .catch(function(e) {
            return that.save({
                statusId: ExecutionStatus.ID_ERROR
            }, {
                patch: true
            });
        });
        
};

Model.prototype.getScreenshots = function() {
    var that = this;

    var screenshotsPath = [config.rootPath, 'screenshots', that.id, 'old'].join('/');
    var screenshotsPathNew = [config.rootPath, 'screenshots', that.id, 'new'].join('/');

    return B.all([
        new B(function(resolve, reject) {
                glob("*.png", {
                    cwd: screenshotsPath
                }, function(err, files) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(files);
                })
            }),
        new B(function(resolve, reject) {
                glob("*.png", {
                    cwd: screenshotsPathNew
                }, function(err, files) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(files);
                })
            })
    ])
        .spread(function(oldScreenshots, newScreenshots) {
            return {
                oldScreenshots: oldScreenshots,
                newScreenshots: newScreenshots
            };
        });
};



Model.prototype.job = function() {
    var Other = require('./job');
    return this.belongsTo(Other, 'jobId');
};


module.exports = Model;
