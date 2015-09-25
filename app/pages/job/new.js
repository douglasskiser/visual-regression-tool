/*global _, _s, app*/
define(function(require) {
    var Super = require('views/page'),
        B = require('bluebird'),
        BoxCollection = require('collections/box'),
        ScriptCollection = require('collections/script'),
        DeviceCollection = require('collections/device'),
        TypeCollection = require('collections/job-type'),
        StatusCollection = require('collections/execution-status'),
        ExecutionCollection = require('collections/execution'),
        Collection = require('collections/job'),
        MAIN = require('hbs!./new.tpl');

    var Page = Super.extend({});

    Page.prototype.initialize = function(options) {
        var that = this;

        Super.prototype.initialize.call(that, options);
        
        that.boxCollection = new BoxCollection();
        that.typeCollection = new TypeCollection();
        that.scriptCollection = new ScriptCollection();
        that.deviceCollection = new DeviceCollection();
        that.statusCollection = new StatusCollection();
        that.executionCollection = new ExecutionCollection();
        this.jobCollection = new Collection();
    };
    
    Page.prototype.getCollection = function() {
        return new Collection();
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
                that.deviceCollection.fetch(),
                that.typeCollection.fetch(),
                that.statusCollection.fetch(),
                that.executionCollection.fetch(),
                that.jobCollection.fetch()
                ]);
    };

    Page.prototype.render = function() {
        var that = this;
        
        console.log(this);
        
        this.preRender()
            .then(function() {
                var executions = [];
                
                _.each(that.executionCollection.models, function(model) {
                    var jobModel = that.jobCollection.get(model.attributes.jobId);
                    console.log('DATA: ', {
                        model: model.attributes,
                        job: jobModel.attributes
                    })
                    executions.push({
                        model: model.attributes,
                        job: jobModel.attributes
                    });
                });
                
                console.log('Executions : ', executions);
                
                that.$el.html(MAIN({
                    id: that.id,
                    data: executions
                }));
                
                that.mapControls();
            })
            .then(function() {
                var events = {};
                that.delegateEvents(events);
            })
            .finally(function() {
                console.log(that);
                that.ready();
            });
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
            if (value) {
                switch (key) {
                    case 'boxIds':
                        memo.push({
                            field: 'oldBoxId',
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
                    case 'statusIds':
                        memo.push({
                            field: 'statusId',
                            value: parseValue(value),
                            operand: 'in'
                        });
                        break;
                }
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