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
        var that = this, path;
        
        //return B.resolve(function() {
            // console.log('getting screenshots');
            // app.webSocket.emit('execution:screenshots', {_id: that.id});
            // app.on('data:execution:screenshots', function(resp) {
            //     console.log('got data for screenshots ', resp);
            //     var oldScreenshots = _.sortBy(resp.oldScreenshots, function(screenshot) {
            //         return parseInt(/^(\d+)-/.exec(screenshot)[1], 10);
            //     });

            //     var newScreenshots = _.sortBy(resp.newScreenshots, function(screenshot) {
            //         return parseInt(/^(\d+)-/.exec(screenshot)[1], 10);
            //     });

            //     var baseUrl = that.getScreenshotBaseUrl();

            //     //for now let's render all of them at once
            //     return (function() {
            //         if (oldScreenshots.length > newScreenshots.length) {
            //             return _.map(oldScreenshots, function(s) {
            //                 if (job.get('typeId') === JobType.ID_VISUAL_REGRESSION) {
            //                     path = baseUrl + '/old/' + s;
            //                 }
            //                 else if (job.get('typeId') === JobType.ID_CHANGES_MODERATOR) {
            //                     path = ['screenshots', 'job', job.id, 'baseline', ] + '/' + s;
            //                 }

            //                 return {
            //                     caption: s.replace(/^\d+-(.+)\.png$/, '$1'),
            //                     oldScreenshot: path,
            //                     newScreenshot: _.contains(newScreenshots, s) ? (baseUrl + '/new/' + s) : undefined
            //                 };
            //             });
            //         }
            //         return _.map(newScreenshots, function(s) {
            //             var path;

            //             if (job.get('typeId') === JobType.ID_VISUAL_REGRESSION) {
            //                 path = baseUrl + '/new/' + s;
            //             }
            //             else if (job.get('typeId') === JobType.ID_CHANGES_MODERATOR) {
            //                 path = baseUrl + '/' + s;
            //             }
            //             return {
            //                 caption: s.replace(/^\d+-(.+)\.png$/, '$1'),
            //                 newScreenshot: path,
            //                 oldScreenshot: _.contains(oldScreenshots, s) ? (baseUrl + '/old/' + s) : undefined
            //             };
            //         });
            //     })();
            // });
        //})
        
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
                    if (oldScreenshots.length > newScreenshots.length) {
                        return _.map(oldScreenshots, function(s) {
                            if (job.get('typeId') === JobType.ID_VISUAL_REGRESSION) {
                                path = baseUrl + '/old/' + s;
                            }
                            else if (job.get('typeId') === JobType.ID_CHANGES_MODERATOR) {
                                path = ['screenshots', 'job', job.id, 'baseline', ] + '/' + s;
                            }

                            return {
                                caption: s.replace(/^\d+-(.+)\.png$/, '$1'),
                                oldScreenshot: path,
                                newScreenshot: _.contains(newScreenshots, s) ? (baseUrl + '/new/' + s) : undefined
                            };
                        });
                    }
                    return _.map(newScreenshots, function(s) {
                        var path;

                        if (job.get('typeId') === JobType.ID_VISUAL_REGRESSION) {
                            path = baseUrl + '/new/' + s;
                        }
                        else if (job.get('typeId') === JobType.ID_CHANGES_MODERATOR) {
                            path = baseUrl + '/' + s;
                        }
                        return {
                            caption: s.replace(/^\d+-(.+)\.png$/, '$1'),
                            newScreenshot: path,
                            oldScreenshot: _.contains(oldScreenshots, s) ? (baseUrl + '/old/' + s) : undefined
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