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
    env = process.env.NODE_ENV || 'development',
    config = require('../../config/config')[env],
    errors = require('../../components/errors/errors');

// private methods
var _methods = {
    run: function(exc) {
        
        async.waterFall([
            // get job
            function(cb) {
                Job.find({
                    id: exc.jobId
                }, function(err, job) {
                    if (err) {
                        return errors.handleResponseError(null, 500, err);
                    }
                    return cb(null, job);
                });
            },
            // get old box
            function(job, cb) {
                Box.find({
                    id: job.oldBoxId
                }, function(err, oldBox) {
                    if (err) {
                        return errors.handleResponseError(null, 500, err);
                    }
                    return cb(null, job, oldBox);
                });
            },
            // get script
            function(job, oldBox, cb) {
                Script.find({
                    id: job.scriptId
                }, function(err, script) {
                    if (err) {
                        return errors.handleResponseError(null, 500, err);
                    }
                    return cb(null, job, oldBox, script);
                });
            },
            // get device
            function(job, oldBox, script, cb) {
                Device.find({
                    id: job.deviceId
                }, function(err, device) {
                    if (err) {
                        return errors.handleResponseError(null, 500, err);
                    }
                    return cb(null, job, oldBox, script, device);
                });
            },
            // handle job type
            function(job, oldBox, script, device, cb) {
                if (job.type === 'visual_regression') {
                    Box.find({
                        id: job.newBoxId
                    }, function(err, newBox) {
                        if (err) {
                            return errors.handleResponseError(null, 500, err);
                        }
                        return cb(null, job, oldBox, script, device, newBox);
                    });
                }
                else if (job.type === 'changes_moderator') {
                    return cb(null, job, oldBox, script, device, null);
                }
            },
            // save execution status
            function(job, oldBox, script, device, newBox, cb) {
                exc.status = 'running';
                exc.save(function(err) {
                    if (err) {
                        return errors.handleResponseError(null, 500, err);
                    }
                    logger.info('done fetching required models');
                    // finish
                    var scriptAbsPath = scriptCtrl.getAbsolutePath(script);
                    var executionBasePath = _methods.getExecutionBasePath(exc);
                    var screenshotsPath = [executionBasePath, 'screenshots'].join('/');
                    var logPath = [executionBasePath, 'log.txt'].join('/');
                    var url = oldBox.url;
                    
                    if (job.type === 'visual_regression') {
                        var oldScreenshotsPath = [screenshotsPath, 'old'].join('/');
                        var newScreenshotsPath = [screenshotsPath, 'new'].join('/');
                        var newUrl = newBox.url;
                        
                        var oldCmd = [config.casper.absolutePath, scriptAbsPath, '--target=' + oldScreenshotsPath, '--url=' + url, '--width=' + device.width, '--height=' + device.height, ' > ', logPath, '2>&1'].join(' ');
                        var newCmd = [config.casper.absolutePath, scriptAbsPath, '--target=' + newScreenshotsPath, '--url=' + newUrl, '--width=' + device.width, '--height=' + device.height, ' >> ', logPath, '2>&1'].join(' ');

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
                                    })();
                                });
                            });
                    } else if (job.type === 'changes_moderator') {
                        logger.info('Running Changes Moderator job');

                        var cmd = [config.casper.absolutePath, scriptAbsPath, '--target=' + screenshotsPath, '--url=' + url, '--width=' + device.width, '--height=' + device.height, ' > ', logPath, '2>&1'].join(' ');
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
                    exc.save(function(err) {
                        if (err) {
                            return errors.handleErrorResponse(null, 500, err);
                        }
                    });
                })
                .catch(function(e) {
                    logger.error('Error while runnning visual regression', e);
                    exc.status = 'error';
                    exc.save(function(err) {
                        if (err) {
                            return errors.handleErrorResponse(null, 500, err);
                        }
                    });
                });
            }
        ], function() {
            //done 
        });
    },
    
    getExecutionBasePath: function(exc) {
        return [config.rootPath, 'data', 'executions', exc.id].join('/');
    },
    
    getScreenshots: function(exc) {
        var executionBasePath = _methods.getExecutionBasePath(exc);
        var screenshotsPath = [executionBasePath, 'screenshots'].join('/');
        
        Job.find({id: exc.jobId}, function(err, job) {
            if (err) {
                return errors.handleErrorResponse(null, 500, err);
            }
            
            if (job.type === 'visual_regression') {
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
            } else if (job.type === 'changes_moderator') {
                var baselineScreenshotsPath = [config.rootPath, 'data', 'job', job._id, 'baseline'].join('/');

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
    Execution.findById(req.params.id, function(err, exc) {
        if (err) {
            return errors.handleResponseError(res, 500, err);
        }
        return res.json(exc);
    });
};

exports.terminateRunningExecutions = function(req, res) {
    var numOfTerminations = 0;
    
    Execution.find({status: 'running'}, function(err, excsRunning) {
        if (err) {
            return errors.handleResponseError(res || null, 500, err);
        }
        if (excsRunning.length) {
            excsRunning.forEach(function(exc) {
                exc.status = 'terminated';
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

exports.checkExecutionQueue = function(req, res) {
    Execution.find({status: 'scheduled'}, function(err, excs) {
        if (err) {
            return errors.handleResponseError(res || null, 500, err);
        }
        logger.info('Found ' + excs.length + 'ready for execution. Will schedule to run now...');
        
        excs.forEach(function(exc) {
            _methods.run(exc);
        });
        
        if (res) {
            res.send(200);
        }
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

exports.delete = function(req, res) {
    Execution.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            return errors.handleResponseError(res, 500, err);
        }
        
        return res.send(200);
    });
};

exports.run = function(req, res) {
    Execution.findById(req.params.id, function(err, exc) {
        if (err) {
            return errors.handleResponseError(res, 500, err);
        }
        _methods.run(exc);
        return res.send(200);
    }); 
};

exports.screenshots = function(req, res) {
    Execution.findById(req.params.id, function(err, exc) {
        if (err) {
            return errors.handleResponseError(res, 500, err);
        }
        
        var ss = _methods.getScreenshots(exc);
        
        return res.send(ss);
    });
};

// export _methods for socket use
exports.methods = _methods;