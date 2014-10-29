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
    Model = Super.extend({
        tableName: 'Execution',
        defaults: {
            status: 0 //0 - created, 10-running, 20-completed, 400 - error
        }
    });

Model.STATUS_CREATED = 0;
Model.STATUS_RUNNING = 10;
Model.STATUS_COMPLETED = 20;
Model.STATUS_ERROR = 400;

Model.STATUSES = {};

Model.STATUSES[Model.STATUS_CREATED] = 'Created';
Model.STATUSES[Model.STATUS_RUNNING] = 'Running';
Model.STATUSES[Model.STATUS_COMPLETED] = 'Completed';
Model.STATUSES[Model.STATUS_ERROR] = 'Error';


Model.prototype.run = function() {
    var script, oldBox, newBox, device, that = this;
    return B.all([
            that.script().fetch(),
            that.oldBox().fetch(),
            that.newBox().fetch(),
            that.device().fetch()
        ])
        .spread(function(s, o, n, d) {
            script = s;
            oldBox = o;
            newBox = n;
            device = d;

            return that.save({
                status: Model.STATUS_RUNNING
            }, {
                patch: true
            });
        })
        .then(function() {
            // console.log(script, oldBox, newBox, device);
            var scriptAbsPath = [config.rootPath, 'background', 'scripts', script.get('path')].join('/');
            var screenshotsPath = [config.rootPath, 'screenshots', that.id].join('/');
            var oldScreenshotsPath = [screenshotsPath, 'old'].join('/');
            var oldUrl = oldBox.get('url');
            var oldCmd = [config.casper.absolutePath, scriptAbsPath, '--target=' + oldScreenshotsPath, '--url=' + oldUrl, '--width=' + device.get('width'), '--height=' + device.get('height')].join(' ');

            var newUrl = newBox.get('url');
            var newScreenshotsPath = [screenshotsPath, 'new'].join('/');
            var newCmd = [config.casper.absolutePath, scriptAbsPath, '--target=' + newScreenshotsPath, '--url=' + newUrl, '--width=' + device.get('width'), '--height=' + device.get('height')].join(' ');

            console.log('Starting ' + oldCmd);
            console.log('Starting ' + newCmd);

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
                    return B.all([
                        (function() {
                            return new B(function(resolve, reject) {
                                nexpect.spawn(oldCmd)
                                    .run(function(err, stdout, exitcode) {
                                        resolve({
                                            err: err,
                                            stdout: stdout,
                                            exitCode: exitcode
                                        });
                                    });
                            })
                        })(),
                        (function() {
                            return new B(function(resolve, reject) {
                                nexpect.spawn(newCmd)
                                    .run(function(err, stdout, exitcode) {
                                        resolve({
                                            err: err,
                                            stdout: stdout,
                                            exitCode: exitcode
                                        });
                                    });
                            });
                        })()

                            ]);
                });
        })
    .spread(function(oldResult, newResult) {
        if (oldResult.err || newResult.err) {
            return that.save({
                status: Model.STATUS_ERROR
            }, {
                patch: true
            });
        }

        return that.save({
            status: Model.STATUS_COMPLETED
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


Model.prototype.script = function() {
    var Other = require('./script');
    return this.belongsTo(Other, 'scriptId');
};

Model.prototype.oldBox = function() {
    var Other = require('./box');
    return this.belongsTo(Other, 'oldBoxId');
};

Model.prototype.newBox = function() {
    var Other = require('./box');
    return this.belongsTo(Other, 'newBoxId');
};

Model.prototype.device = function() {
    var Other = require('./device');
    return this.belongsTo(Other, 'deviceId');
};

module.exports = Model;
