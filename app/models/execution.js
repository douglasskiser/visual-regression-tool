/* global app*/
define(function(require) {
    var Super = require('./base'),
        _ = require("underscore"),
        B = require('bluebird');

    var Model = Super.extend({
        name: 'execution'
    });
    
    Model.prototype.getScreenshots = function() {
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
                    if (oldScreenshots.length > newScreenshots.length) {
                        return _.map(oldScreenshots, function(s) {
                            return {
                                caption: s.replace(/^\d+-(.+)\.png$/, '$1'),
                                oldScreenshot: baseUrl + '/old/' + s,
                                newScreenshot: _.contains(newScreenshots, s) ?  (baseUrl + '/new/' + s) : undefined
                            };
                        });
                    }
                    return _.map(newScreenshots, function(s) {
                        return {
                            caption: s.replace(/^\d+-(.+)\.png$/, '$1'),
                            newScreenshot: baseUrl + '/new/' +s,
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