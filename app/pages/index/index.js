/*global _, _s*/
define(function(require) {
    var Super = require('views/page/list'),
        B = require('bluebird'),
        Filter = require('./index/filter'),
        Result = require('./index/result'),
        BoxCollection = require('collections/box'),
        ScriptCollection = require('collections/script'),
        ScriptBoxCollection = require('collections/script-box'),
        DeviceCollection = require('collections/device'),
        Collection = require('collections/execution'),
        Execution = require('models/execution'),
        Select2 = require('select2');

    var Page = Super.extend({
        className: 'list'
    });


    Page.prototype.initialize = function(options) {
        var that = this;
        //super(options)
        Super.prototype.initialize.call(that, options);

        if (!that.collection) {
            that.collection = new Collection();
        }

        that.boxCollection = new BoxCollection();
        that.scriptCollection = new ScriptCollection();
        that.scriptBoxCollection = new ScriptBoxCollection();
        that.deviceCollection = new DeviceCollection();


    };
    Page.prototype.getRenderOptions = function() {
        return {
            pageName: 'Jobs'
        };
    };

    Page.prototype.preRender = function() {
        var that = this;
        return B.all([
                that.boxCollection.fetch(),
                that.scriptCollection.fetch(),
                that.scriptBoxCollection.fetch(),
                that.deviceCollection.fetch()]);
    };



    Page.prototype.getFilterOptions = function() {
        var that = this;
        
        return {
            boxCollection: that.boxCollection,
            scriptCollection: that.scriptCollection,
            scriptBoxCollection: that.scriptBoxCollection,
            deviceCollection: that.deviceCollection
        };
    };
    
    Page.prototype.getResultOptions = function() {
        var that = this;
        return {
            boxCollection: that.boxCollection,
            scriptCollection: that.scriptCollection,
            scriptBoxCollection: that.scriptBoxCollection,
            deviceCollection: that.deviceCollection
        }
    };

    Page.prototype.getFilterClass = function() {
        return Filter;
    };
    
    Page.prototype.getResultClass = function() {
        return Result;
    };

    return Page;


});