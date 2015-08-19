var Execution = require('./execution.model'),
    Job = require('../job/job.model'),
    Box = require('../box/box.model'),
    Script = require('../script/script.model'),
    Device = require('../device/device.model'),
    async = require('async'),
    logger = require('../../components/logger/logger');
    
function run(exc) {
    async.waterFall([
            // get job
            function(cb) {
                Job.find({id: exc.jobId}, function(err, job) {
                    if (err) {
                        // handle err
                    }
                    return cb(null, job);
                });
            },
            // get old box
            function(job, cb) {
                Box.find({id: job.oldBoxId}, function(err, oldBox) {
                     if (err) {
                        // handle err
                    }
                    return cb(null, job, oldBox);
                });
            },
            // get script
            function(job, oldBox, cb) {
                Script.find({id: job.scriptId}, function(err, script) {
                    if (err) {
                        // handle err
                    }
                    return cb(null, job, oldBox, script);
                });
            },
            // get device
            function(job, oldBox, script, cb) {
                Device.find({id: job.deviceId}, function(err, device) {
                    if (err) {
                        // handle err
                    }
                    return cb(null, job, oldBox, script, device);
                });
            },
            // handle job type
            function(job, oldBox, script, device, cb) {
                if (job.type === 'visual_regression') {
                    Box.find({id: job.newBoxId}, function(err, newBox) {
                        if (err) {
                            // handle err
                        }
                        return cb(null, job, oldBox, script, device, newBox);
                    });
                } else if (job.type === 'changes_moderator') {
                    return cb(null, job, oldBox, script, device, null);
                }
            },
            function(job, oldBox, script, device, newBox, cb) {
                exc.status = 'running';
                exc.save(function(err) {
                    if (err) {
                        // handle err
                    }
                    logger.info('done fetching required models');
                    // finish execution
                });
            }
        ], function() {
           //done 
        });
}

exports.get = function(req, res) {
    Execution.find(function(err, excs) {
        if (err) {
            return res.send(500, err);
        }
        return res.json(excs);
    });
};

exports.getOne = function(req, res) {
    Execution.findById(req.params.id, function(err, exc) {
        if (err) {
            return res.send(500, err);
        }
        return res.json(exc);
    });
};

exports.terminateRunningExecutions = function(req, res) {
    var numOfTerminations = 0;
    
    Execution.find({status: 'running'}, function(err, excsRunning) {
        if (err) {
            // handle err
        }
        if (excsRunning.length) {
            excsRunning.forEach(function(exc) {
                exc.status = 'terminated';
                exc.save(function(err) {
                    if (err) {
                        // handle err
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
            // handle err
        }
        logger.info('Found ' + excs.length + 'ready for execution. Will schedule to run now...');
        
        excs.forEach(function(exc) {
            run(exc);
        });
        
        if (res) {
            res.send(200);
        }
    });
};