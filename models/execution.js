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
            device = new Device({
                id: job.get('deviceId')
            });

            if (job.get('typeId') == JobType.ID_VISUAL_REGRESSION) {
                newBox = new Box({
                    id: job.get('newBoxId')
                });

                return B.all([oldBox.fetch(), newBox.fetch(), script.fetch(), device.fetch()]);
            }
            else if (job.get('typeId') == JobType.ID_CHANGES_MODERATOR) {
                return B.all([oldBox.fetch(), script.fetch(), device.fetch()]);
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
            logger.info('done fetching required models');

            var scriptAbsPath = script.getAbsolutePath();
            var executionBasePath = that.getExecutionBasePath();
            var screenshotsPath = [executionBasePath, 'screenshots'].join('/');
            var logPath = [executionBasePath, 'log.txt'].join('/');
            var url = oldBox.get('url');

            if (job.get('typeId') == JobType.ID_VISUAL_REGRESSION) {

                var oldScreenshotsPath = [screenshotsPath, 'old'].join('/');
                var newScreenshotsPath = [screenshotsPath, 'new'].join('/');


                var newUrl = newBox.get('url');

                var oldCmd = [config.casper.absolutePath, scriptAbsPath, '--target=' + oldScreenshotsPath, '--url=' + url, '--width=' + device.get('width'), '--height=' + device.get('height'), ' > ', logPath, '2>&1'].join(' ');
                var newCmd = [config.casper.absolutePath, scriptAbsPath, '--target=' + newScreenshotsPath, '--url=' + newUrl, '--width=' + device.get('width'), '--height=' + device.get('height'), ' >> ', logPath, '2>&1'].join(' ');

                return B.resolve(new B(function(resolve, reject) {
                        nexpect.spawn('rm -rf ' + screenshotsPath)
                            .run(function(err, stdout, exitcode) {
                                resolve({
                                    err: err,
                                    stdout: stdout,
                                    exitCode: exitcode
                                });
                            });

                    }))
                    .then(function() {
                        return B.resolve(
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
                            })()
                        ).then(function() {
                            return (function() {
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
                        });
                    });
            }
            else if (job.get('typeId') == JobType.ID_CHANGES_MODERATOR) {
                logger.info('Running Changes Moderator job');

                var cmd = [config.casper.absolutePath, scriptAbsPath, '--target=' + screenshotsPath, '--url=' + url, '--width=' + device.get('width'), '--height=' + device.get('height'), ' > ', logPath, '2>&1'].join(' ');
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
            logger.error('Error while runnning visual regression', e);
            return that.save({
                statusId: ExecutionStatus.ID_ERROR
            }, {
                patch: true
            });
        });

};

Model.prototype.getExecutionBasePath = function() {
    var that = this;
    return [config.rootPath, 'data', 'executions', that.id].join('/');
};

Model.prototype.getScreenshots = function() {
    var that = this;
    var executionBasePath = that.getExecutionBasePath();
    var screenshotsPath = [executionBasePath, 'screenshots'].join('/');
    return Job.forge({
            id: that.get('jobId')
        })
        .fetch()
        .then(function(job) {

            if (job.get('typeId') === JobType.ID_VISUAL_REGRESSION) {
                var oldScreenshotsPath = [screenshotsPath, 'old'].join('/');
                var newScreenshotsPath = [screenshotsPath, 'new'].join('/');


                return B.all([
                        new B(function(resolve, reject) {
                            glob("*.png", {
                                cwd: oldScreenshotsPath
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
                                cwd: newScreenshotsPath
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
            }
            else if (job.get('typeId') === JobType.ID_CHANGES_MODERATOR) {
                var baselineScreenshotsPath = [config.rootPath, 'data', 'job', job.id, 'baseline'].join('/');


                return B.all([
                        new B(function(resolve, reject) {
                            glob("*.png", {
                                cwd: baselineScreenshotsPath
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
                                cwd: screenshotsPath
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
            }
            return B.resolve();
        });

    


};



Model.prototype.job = function() {
    var Other = require('./job');
    return this.belongsTo(Other, 'jobId');
};


module.exports = Model;
