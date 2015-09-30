/*global _, _s, Backbone, app*/
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
        MAIN = require('hbs!./new.tpl'),
        Panel = require('views/controls/panel');

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

    Page.prototype.getPanelClass = function(data) {
        var panelClass = '';
        
        console.log('status-id: ', data);
        
        switch (data) {
            case 'Scheduled':
                panelClass = 'info';
                break;
            case 'Running':
                panelClass = 'info';
                break;
            case 'Completed':
                panelClass = 'success';
                break;
            case 'Error':
                panelClass = 'danger';
                break;
            case 'Terminated':
                panelClass = 'warning';
                break;
        }        
        
        return panelClass;
    };
    
    Page.prototype.getPanelIcon = function(data) {
        var panelClass = '';
        
        console.log('status-id: ', data);
        
        switch (data) {
            case 'Scheduled':
                panelClass = 'fa-check-circle';
                break;
            case 'Running':
                panelClass = 'fa-check-circle';
                break;
            case 'Completed':
                panelClass = 'fa-check-circle';
                break;
            case 'Error':
                panelClass = 'fa-exclamation-circle';
                break;
            case 'Terminated':
                panelClass = 'fa-exclamation-circle';
                break;
        }        
        
        return panelClass;
    };
    
    Page.prototype.getData = function() {
        var that = this;
        
        var jobs = [];
        
        var excsCollection = new Backbone.Collection(that.executionCollection.where({ownerId: app.user.get('_id')}));
        
        var jobIds = _.uniq(excsCollection.pluck('jobId'));
        
        _.each(jobIds, function(id) {
            var excs = _.each(excsCollection.where({jobId: id}), function(item) {
                item.set({
                    status: that.getPanelClass(that.statusCollection.get(item.get('statusId')).get('name')),
                    icon: that.getPanelIcon(that.statusCollection.get(item.get('statusId')).get('name'))
                });
            });
            
            var j = that.jobCollection.get(id);
            
            if (j !== undefined) {
                j.set({
                    idAttribute: '_id',
                    executions: excs
                });
                jobs.push(j);
            }
        });
        
        return jobs;
    };
    
    Page.prototype.createPanels = function(data) {
        var view = this.$el.find('.panel-container');
        _.each(data, function(model) {
            var panel = new Panel({model: model});
            view.append(panel.render()); 
        });
    };

    Page.prototype.render = function() {
        var that = this;
        
        console.log(this);
        
        this.preRender()
            .then(function() {
                var data = that.getData();
                
                that.$el.html(MAIN({
                    id: that.id
                }));
                
                that.createPanels(data);
                
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