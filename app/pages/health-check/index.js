/*global _, _s*/
define(function(require) {
    var Super = require('views/page/list'),
        B = require('bluebird'),
        Filter = require('./index/filter'),
        Result = require('./index/result'),
        Collection = require('collections/health-check'),
        BoxCollection = require('collections/box');

    var Page = Super.extend({});


    Page.prototype.getCollection = function() {
        var that = this;

        that.boxCollection = new BoxCollection();

        return new Collection();
    };

    Page.prototype.getRenderOptions = function() {
        return {
            pageName: 'Health Check'
        };
    };

    Page.prototype.preRender = function() {
        return this.boxCollection.fetch();
    };

    Page.prototype.getResultOptions = function() {
        return {
            boxCollection: this.boxCollection
        };
    };


    Page.prototype.getFilterOptions = function() {
        var that = this;

        return {};
    };

    Page.prototype.getFilterClass = function() {
        return Filter;
    };

    Page.prototype.getResultClass = function() {
        return Result;
    };

    return Page;


});