/* global app*/
define(function(require) {
    var Super = require('./base'),
        JobType = require('./job-type'),
        _ = require("underscore"),
        B = require('bluebird');

    var Model = Super.extend({
        name: 'execution'
    });

    Model.prototype.getScreenshots = function(job) {
        var that = this;

        return B.resolve(app.socket.request({
                url: '/execution/' + that.id + '/screenshots'
            }))
            .then(function(resp) {
                var oldScreenshots = _.sortBy(resp.oldScreenshots, function(screenshot) {
                    return parseInt(/^(\d+)-/.exec(screenshot)[1], 10);
                });

                var newScreenshots = _.sortBy(resp.newScreenshots, function(screenshot) {
                    return parseInt(/^(\d+)-/.exec(screenshot)[1], 10);
                });

                var baseUrl = that.getScreenshotBaseUrl();

                //for now let's render all of them at once
                return (function() {
                    var path;
                    if (oldScreenshots.length > newScreenshots.length) {
                        return _.map(oldScreenshots, function(s) {
                            var newScreenshot, oldScreenshot;

                            if (job.get('typeId') === JobType.ID_VISUAL_REGRESSION) {
                                newScreenshot = baseUrl + '/new/' + s;
                                oldScreenshot = baseUrl + '/old/' + s;
                            }
                            else if (job.get('typeId') === JobType.ID_CHANGES_MODERATOR) {
                                newScreenshot = baseUrl + '/' + s;
                                oldScreenshot = ['data', 'jobs', that.get('jobId'), 'baseline', s].join('/');
                            }

                            return {
                                caption: s.replace(/^\d+-(.+)\.png$/, '$1'),
                                oldScreenshot: oldScreenshot,
                                newScreenshot: _.contains(newScreenshots, s) ? newScreenshot : undefined
                            };
                        });
                    }
                    return _.map(newScreenshots, function(s) {
                        var newScreenshot, oldScreenshot;

                        if (job.get('typeId') === JobType.ID_VISUAL_REGRESSION) {
                            newScreenshot = baseUrl + '/new/' + s;
                            oldScreenshot = baseUrl + '/old/' + s;
                        }
                        else if (job.get('typeId') === JobType.ID_CHANGES_MODERATOR) {
                            newScreenshot = baseUrl + '/' + s;
                            oldScreenshot = ['data', 'jobs', that.get('jobId'), 'baseline', s].join('/');
                        }
                        return {
                            caption: s.replace(/^\d+-(.+)\.png$/, '$1'),
                            newScreenshot: newScreenshot,
                            oldScreenshot: _.contains(oldScreenshots, s) ? oldScreenshot : undefined
                        };
                    });
                })();

            });


    };

    Model.prototype.getScreenshotBaseUrl = function() {
        var that = this;
        return ['screenshots', that.id, 'screenshots'].join('/');
    };

    return Model;
});