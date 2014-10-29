/*global _, _s*/
define(function(require) {
    var Super = require('views/page'),
        B = require('bluebird'),
        Template = require('hbs!./index.tpl');

    var Page = Super.extend({});

    Page.prototype.initialize = function(options) {
        //super(options)
        Super.prototype.initialize.call(this, options);
    };

    Page.prototype.render = function() {
        var that = this;

        that.$el.html(Template({
            id: that.id
        }));

        that.mapControls();

        var events = {};
        that.delegateEvents(events);

        that.ready();


    };
    return Page;


});