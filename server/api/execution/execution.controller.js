var Execution = require('./execution.model'),
    logger = require('../../components/logger/logger');

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