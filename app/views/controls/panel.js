/*global _, _s, Backbone, app*/
define(function(require) {
    var Super = require('views/base'),
        B = require('bluebird'),
        moment = require('moment'),
        BoxCollection = require('collections/box'),
        ScriptCollection = require('collections/script'),
        DeviceCollection = require('collections/device'),
        TypeCollection = require('collections/job-type'),
        StatusCollection = require('collections/execution-status'),
        ExecutionCollection = require('collections/execution'),
        Collection = require('collections/job'),
        Execution = require('models/execution'),
        ExecutionStatus = require('models/execution-status'),
        Dialog = require('views/controls/dialog'),
        NProgress = require('nprogress'),
        Template = require('hbs!./panel.tpl');


    var View = Super.extend({});

    View.Panels = Backbone.Collection.extend();

    View.prototype.initialize = function(options) {
        //super(options)
        Super.prototype.initialize.call(this, options);

        console.log('Panel Model : ', this.model);

        this.statusCollection = new StatusCollection();
        this.scriptCollection = new ScriptCollection();
        
        this.fetchData()
            .then(function() {
                this.createListener();
            }.bind(this));
    };
    
    View.prototype.createListener = function() {
        var that = this;
        app.webSocket.on('data:execution:status', function(data) {
            if (data.jobId === that.model.get('_id')) {
                var excs = that.model.get('executions');
                
                that.model.set({
                    status: that.getPanelClass(that.statusCollection.get(data.statusId).get('name')),
                    icon: that.getPanelIcon(that.statusCollection.get(data.statusId).get('name'))
                });
                
                if (excs.get(data._id)) {
                    excs.get(data._id).set({
                        status: that.getPanelClass(that.statusCollection.get(data.statusId).get('name')),
                        icon: that.getPanelIcon(that.statusCollection.get(data.statusId).get('name'))
                    });
                    console.log('Could not set the execution model');
                }
                
                
                
                console.log('Found My Execution In Model Then Updated');
                
                that.render();
            }
        });
        
        app.webSocket.on('data:execution:create', function(data) {
            console.log('Got data from create', data);
            if (data.jobId === that.model.get('_id')) {
                var excs = that.model.get('executions');
                
                data.status = 'info';
                data.icon = 'fa-spin fa-spinner';
                
                excs.unshift(new Execution(data));
                
                that.render();
            }
        });
    };

    View.prototype.getPanelClass = function(data) {
        var panelClass = '';

        switch (data) {
            case 'Scheduled':
                panelClass = 'info';
                break;
            case 'Running':
                panelClass = 'info';
                break;
            case 'Completed':
                panelClass = 'material-green-A400';
                break;
            case 'Error':
                panelClass = 'material-red-A700';
                break;
            case 'Terminated':
                panelClass = 'warning';
                break;
        }

        return panelClass;
    };

    View.prototype.getPanelIcon = function(data) {
        var panelClass = '';

        switch (data) {
            case 'Scheduled':
                panelClass = 'fa-check-circle';
                break;
            case 'Running':
                panelClass = 'fa-spin fa-spinner';
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

    View.prototype.fetchData = function() {
        var that = this;
        return B.all([
            that.statusCollection.fetch(),
            that.scriptCollection.fetch()
        ]);
    }

    View.prototype.render = function(newModel) {
        var that = this;
        var panelEl = that.$el.find('div.panel-' + that.model.id);
        
        if (newModel) {
            newModel.set({
                collapsed: that.model.get('collapsed')
            });
            that.model = newModel;
        }


        // that.listenTo(that.model, 'change', that.render.bind(that));
        
        if (panelEl.length > 0) {
            panelEl.html(Template({
                id: that.id,
                model: that.model.toJSON(),
                idAttribute: '_id'
            }));
            console.log('replaced panel');
        } else {
            that.$el.append(Template({
                id: that.id,
                model: that.model.toJSON(),
                idAttribute: '_id'
            }));
            console.log('created new panel');
        }

        that.mapControls();

        var events = {};

        events['click .run-btn'] = 'onRunClickHandler';
        events['click .run-all-btn'] = 'onRunAllClickHandler';
        events['click .job-checkbox'] = 'onCheckboxClickHandler';
        events['click .job-delete-btn'] = 'deleteButtonClickHandler';
        events['click [href="#collapse-' + that.model.id + '"]'] = 'onPanelToggleHandler';

        that.delegateEvents(events);

    };
    
    View.prototype.onPanelToggleHandler = function(event) {
        if (this.model.get('collapsed') === undefined) {
            this.model.set({
                collapsed: true
            });
        }
        
        var currentState = this.model.get('collapsed');
        
        console.log('Before collapse toggle ', this.model.get('collapsed'));
        this.model.set({collapsed: !currentState});
        console.log('After collapse toggle ', this.model.get('collapsed'));
    };

    return View;
});