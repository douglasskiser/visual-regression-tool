var B = require('bluebird'),
    env = process.env.NODE_ENV || 'development',
    config = require('../config')[env],
    _ = require('underscore'),
    path = require('path'),
    uuid = require('node-uuid'),
    glob = require("glob"),
    nexpect = require('nexpect');


exports.requestExecutionId = function(req, res, next) {
    res.send({executionId: uuid.v4()});
};

exports.run = function(req, res, next) {
    var sessionId = req.params.executionId;

    var screenshotsPath = [config.rootPath, 'app', 'dist', config.app.version, 'screenshots', sessionId, 'old'].join('/');
    var cmdOld = "/usr/bin/casperjs /home/aduyng/vrt/background/suites/ssw/full.js --target=" + screenshotsPath + ' --url=' + req.body.oldUrl;
    var screenshotsPathNew = [config.rootPath, 'app', 'dist', config.app.version, 'screenshots', sessionId, 'new'].join('/');
    var cmdNew = "/usr/bin/casperjs /home/aduyng/vrt/background/suites/ssw/full.js --target=" + screenshotsPathNew+ ' --url=' + req.body.newUrl;
    console.log(cmdOld, cmdNew);
    B.all([
            new B(function(resolve, reject) {
                nexpect.spawn(cmdOld)
                    .run(function(err, stdout, exitcode) {
                        resolve({
                            err: err,
                            stdout: stdout,
                            exitCode: exitcode
                        });
                    });
            }),
              new B(function(resolve, reject) {
                nexpect.spawn(cmdNew)
                    .run(function(err, stdout, exitcode) {
                        resolve({
                            err: err,
                            stdout: stdout,
                            exitCode: exitcode
                        });
                    });
            })
        ])
        .then(function() {
            res.send(200, {
                executionId: sessionId
            })
        });
};

exports.screenshots = function(req, res, next) {
    var sessionId = req.params.executionId;
    var screenshotsPath = [config.rootPath, 'app', 'dist', config.app.version, 'screenshots', sessionId, 'old'].join('/');
    var screenshotsPathNew = [config.rootPath, 'app', 'dist', config.app.version, 'screenshots', sessionId, 'new'].join('/');

    B.all([
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
    .spread(function(oldScreenshots, newScreenshots){
        res.send({
            oldScreenshots: oldScreenshots, 
            newScreenshots: newScreenshots
        });
    });

};