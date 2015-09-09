var Execution = require('./execution.model'),
    Job = require('../job/job.model'),
    Box = require('../box/box.model'),
    Script = require('../script/script.model'),
    scriptCtrl = require('../script/script.controller'),
    Device = require('../device/device.model'),
    async = require('async'),
    nexpect = require('nexpect'),
    B = require('bluebird'),
    glob = require('glob'),
    logger = require('../../components/logger/logger'),
    Worker = require('webworker-threads').Worker,
    env = process.env.NODE_ENV || 'development',
    config = require('../../config/config')[env],
    _ = require('underscore'),
    errors = require('../../components/errors/errors'),
    Agenda = require('../../components/agenda/agenda');

// private methods
var _methods = {
    run: function(exc, socket, callback) {
        var job, oldBox, script, device, newBox, self = this;
        callback = callback || function() {};

        return new B(function(resolve, reject) {
                Job.findById(exc.jobId, function(err, jobDoc) {
                    if (err) {
                        reject();
                        return errors.handleResponseError(null, 500, err);
                    }
                    job = jobDoc;
                    return resolve();
                });
            })
            .then(function() {
                return new B(function(resolve, reject) {
                    Box.findById(exc.oldBoxId, function(err, oldBoxDoc) {
                        if (err) {
                            reject();
                            return errors.handleResponseError(null, 500, err);
                        }
                        oldBox = oldBoxDoc;
                        resolve();
                    });
                });
            })
            .then(function() {
                return new B(function(resolve, reject) {
                    Script.findById(exc.scriptId, function(err, scriptDoc) {
                        if (err) {
                            reject();
                            return errors.handleResponseError(null, 500, err);
                        }
                        script = scriptDoc;
                        return resolve();
                    });
                });
            })
            .then(function() {
                return new B(function(resolve, reject) {
                    Device.findById(exc.deviceId, function(err, deviceDoc) {
                        if (err) {
                            reject();
                            return errors.handleResponseError(null, 500, err);
                        }
                        device = deviceDoc;
                        return resolve();
                    });
                });
            })
            .then(function() {
                return new B(function(resolve, reject) {
                    if (job.typeId === 1) {
                        Box.findById(exc.newBoxId, function(err, newBoxDoc) {
                            if (err) {
                                reject();
                                return errors.handleResponseError(null, 500, err);
                            }
                            newBox = newBoxDoc;
                            resolve();
                        });
                        return resolve();
                    }
                });
            })
            .then(function() {
                return new B(function(resolve, reject) {
                    exc.statusId = 2;
                    exc.status = 'running';
                    exc.save(function(err, updatedExc) {
                        if (err) {
                            reject();
                            return errors.handleResponseError(null, 500, err);
                        }
                        exc = updatedExc;
                        return resolve();
                    });
                });
            })
            .then(function() {
                var paths = {},
                    cmds = {};
                paths.scriptAbsPath = scriptCtrl.getAbsolutePath(script);
                paths.executionBasePath = _methods.getExecutionBasePath(exc);
                paths.screenshotsPath = [executionBasePath, 'screenshots'].join('/');
                paths.logPath = [executionBasePath, 'log.txt'].join('/');
                paths.url = oldBox.url;

                if (job.typeId === 1) {
                    paths.oldScreenshotsPath = [paths.screenshotsPath, 'old'].join('/');
                    paths.newScreenshotsPath = [paths.screenshotsPath, 'new'].join('/');
                    paths.newUrl = newBox.url;

                    cmds.old = [config.casper.absolutePath, paths.scriptAbsPath, '--target=' + paths.oldScreenshotsPath, '--url=' + paths.url, '--width=' + device.width, '--height=' + device.height, ' > ', paths.logPath, '2>&1'].join(' ');
                    cmds.new = [config.casper.absolutePath, paths.scriptAbsPath, '--target=' + paths.newScreenshotsPath, '--url=' + paths.newUrl, '--width=' + device.width, '--height=' + device.height, ' > ', paths.logPath, '2>&1'].join(' ');

                    return B.resolve(new B(function(resolve, reject) {
                            nexpect.spawn('rm -rf ' + paths.screenshotsPath)
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
                                    logger.info('start capturing the first URL. Command: ', cmds.old);

                                    return new B(function(resolve, reject) {
                                        nexpect.spawn(cmds.old)
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
                                                logger.info('First URL completed', cmds.old);
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
                                    logger.info('start capturing the second URL. Command: ', cmds.new);

                                    return new B(function(resolve, reject) {
                                        nexpect.spawn(cmds.new)
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
                                                logger.info('Second URL completed', cmds.old);
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
                } else if (job.typeId === 2) {
                    logger.info('Running Changes Moderator job');
                    var cmd = [config.casper.absolutePath, paths.scriptAbsPath, '--target=' + paths.screenshotsPath, '--url=' + paths.url, '--width=' + device.width, '--height=' + device.height, ' > ', paths.logPath, '2>&1'].join(' ');
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
                exc.status = 'completed';
                exc.statusId = 3;
                exc.save(function(err, updatedExc) {
                    if (err) {
                        reject();
                        return errors.handleResponseError(null, 500, err);
                    }
                    socket.io.broadcast('execution:finished', updatedExc);
                    callback(updatedExc);
                    resolve();
                });
            })
            .catch(function(err) {
                logger.error('Error while runnning visual regression', e);
                exc.status = 'error';
                exc.statusId = 4;
                exc.save(function(err, updatedExc) {
                    if (err) {
                        reject();
                        return errors.handleResponseError(null, 500, err);
                    }
                    resolve();
                });
            });
    },

    getExecutionBasePath: function(exc) {
        return [config.rootPath, 'data', 'executions', exc.id].join('/');
    },

    getScreenshots: function(exc) {
        var executionBasePath = _methods.getExecutionBasePath(exc);
        var screenshotsPath = [executionBasePath, 'screenshots'].join('/');

        Job.findById(exc.jobId, function(err, job) {
            if (err) {
                return errors.handleErrorResponse(null, 500, err);
            }

            if (job.typeId === 1) {
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
                            });
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
                            });
                        })
                    ])
                    .spread(function(oldScreenshots, newScreenshots) {
                        return {
                            oldScreenshots: oldScreenshots,
                            newScreenshots: newScreenshots
                        };
                    });
            } else if (job.typeId === 3) {
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
                            });
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
                            });
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
    }
};

// exports
exports.get = function(req, res) {
    Execution.find(function(err, excs) {
        if (err) {
            return errors.handleResponseError(res, 500, err);
        }
        return res.json(excs);
    });
};

exports.getOne = function(req, res) {
    Execution.findOne({
        id: req.params.id
    }, function(err, exc) { //Execution.findById(req.params.id, function(err, device) {
        if (err) {
            return errors.handleResponseError(res, 500, err);
        }
        return res.json(exc);
    });
};

exports.terminateRunningExecutions = function(req, res) {
    var numOfTerminations = 0;

    Execution.find({
        status: 'running'
    }, function(err, excsRunning) {
        if (err) {
            return errors.handleResponseError(res || null, 500, err);
        }
        if (excsRunning.length) {
            excsRunning.forEach(function(exc) {
                exc.status = 'terminated';
                //exc.statusId = 5;
                exc.save(function(err) {
                    if (err) {
                        return errors.handleResponseError(res || null, 500, err);
                    }
                    numOfTerminations++;
                });
            });

            logger.info('There were ' + numOfTerminations + 'terminated.');

            if (res) {
                res.send(200);
            }
        }
    });
};

exports.checkExecutionQueue = function(socket) {
    Execution.find({
        status: 'scheduled'
    }, function(err, excs) {
        if (err) {
            return errors.handleResponseError(null, 500, err);
        }
        if (excs.length) {
            logger.info('Found ' + excs.length + 'ready for execution. Will schedule to run now...');
        } else {
            logger.info('Did not find any ready for execution.');
        }

        if (excs) {
            excs.forEach(function(exc) {
                var worker = new Worker(function() {
                    postMessage('running execution');
                    _methods.run(exc, socket, function() {
                        postMessage('execution finished');
                    });
                });

                worker.onmessage = function(data) {
                    logger.info('Web worker says... ' + data);
                };
            });

        }
        // if (res) {
        //     res.send(200);
        // }
    });
};

exports.create = function(req, res) {
    Execution.create(req.body, function(err, exc) {
        if (err) {
            return errors.handleResponseError(res, 500, err);
        }
        return res.status(200).send(exc);
    });
};

exports.update = function(req, res) {
    Execution.findById(req.params.id, function(err, exc) {
        if (err) {
            return errors.handleResponseError(res, 500, err);
        }
        _.extend(exc, req.body);

        exc.save(function(err, updatedExecution) {
            if (err) {
                return errors.handleResponseError(res, 500, err);
            }
            return res.json(updatedExecution);
        });
    });
};

exports.delete = function(req, res) {
    Execution.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            return errors.handleResponseError(res, 500, err);
        }

        return res.send(200);
    });
};

exports.run = function(id, socket, cb) {
    Execution.findById(id, function(err, exc) {
        if (err) {
            return errors.handleResponseError(null, 500, err);
        }
        _methods.run(exc, socket, cb);
    });
};

exports.screenshots = function(req, res) {
    Execution.findOne({
        id: req.params.id
    }, function(err, exc) {
        if (err) {
            return errors.handleResponseError(res, 500, err);
        }

        var ss = _methods.getScreenshots(exc);

        return res.send(ss);
    });
};

// export _methods for socket use
exports.methods = _methods;
