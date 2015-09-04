/*global _, _s*/
define(function(require) {
    var Super = require('views/page/list'),
        B = require('bluebird'),
        Filter = require('./index/filter'),
        Result = require('./index/result'),
        Collection = require('collections/script');

    var Page = Super.extend({
    });

    Page.prototype.initialize = function(options) {
        var that = this;
        //super(options)
        Super.prototype.initialize.call(that, options);
    };
    
    Page.prototype.getCollection = function(){
        return new Collection();
    };
    
    Page.prototype.getRenderOptions = function() {
        return {
            pageName: 'Scripts'
        };
    };


    Page.prototype.getFilterOptions = function() {
        var that = this;
        
        return {
        };
    };

    Page.prototype.getFilterClass = function() {
        return Filter;
    };
    
    Page.prototype.getResultClass = function() {
        return Result;
    };

    Page.prototype.getFetchColumns = function(){
        return ['id', 'name'];
    };
    return Page;


});