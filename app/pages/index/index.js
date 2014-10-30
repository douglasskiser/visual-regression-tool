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

    Page.prototype.fetch = function() {
        var that = this;
        var data = that.children.filter.serialize();
        var parseValue = function(value) {
            return _.reduce(value.split(','), function(memo, v) {
                var parseValue = parseInt(v);
                if (!isNaN(parseValue)) {
                    memo.push(parseValue);
                }
                return memo;
            }, []);
        };
        var selection = _.reduce(_.omit(data, 'perPage', 'page', 'orderBy'), function(memo, value, key) {
            switch (key) {
                case 'oldBoxIds':
                    memo.push({
                        field: 'oldBoxId',
                        value: parseValue(value),
                        operand: 'in'
                    });
                    break;
                case 'newBoxIds':
                    memo.push({
                        field: 'newBoxId',
                        value: parseValue(value),
                        operand: 'in'
                    });
                    break;
                case 'scriptIds':
                    memo.push({
                        field: 'scriptId',
                        value: parseValue(value),
                        operand: 'in'
                    });
                    break;
                case 'deviceIds':
                    memo.push({
                        field: 'deviceId',
                        value: parseValue(value),
                        operand: 'in'
                    });
                    break;
                case 'statuses':
                    memo.push({
                        field: 'status',
                        value: parseValue(value),
                        operand: 'in'
                    });
                    break;
            }
            return memo;
        }, []);

        var column = that.children.result.getTable().getSortedColumn();
        var orderBy = {};
        if (column) {
            orderBy[column.id] = column.get('direction');
        }
        var page = data.page || 1;
        var perPage = data.perPage || 20;

        return that.collection.fetch({
            data: {
                selection: selection,
                orderBy: orderBy,
                limit: perPage,
                offset: (page - 1) * perPage
            }
        });
    };
    return Page;


});