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
        Execution = require('models/execution'),
        ExecutionStatus = require('models/execution-status'),
        MAIN = require('hbs!./new.tpl'),
        Dialog = require('views/controls/dialog'),
        NProgress = require('nprogress'),
        moment = require('moment'),
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

        this.createListener();

        this.myjobs = new Collection();
    };

    Page.prototype.createListener = function() {
        var that = this;
        app.webSocket.on('data:execution:status', function(data) {
            console.log('GOT SOCKET DATA : ', data);
            
            _.each(that.myjobs.get(data.jobId).get('executions'), function(item) {
                if (item.id === data._id) {
                    item.set({
                        status: that.getPanelClass(that.statusCollection.get(data.statusId).get('name'))
                    });
                    console.log('Execution Set::');
                }
            });
        });
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
        var that = this
        
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

    Page.prototype.fetchData = function() {
        var that = this;
        return B.all([
            that.statusCollection.fetch(),
            that.scriptCollection.fetch(),
            that.boxCollection.fetch(),
            that.scriptCollection.fetch(),
            that.deviceCollection.fetch(),
            that.typeCollection.fetch(),
            that.statusCollection.fetch(),
            that.executionCollection.fetch(),
            that.jobCollection.fetch()
        ]);
    };

    Page.prototype.getData = function() {
        var that = this;

        // that.myjobs = [];

        return that.fetchData()
            .then(function() {
                that.excsCollection = new Backbone.Collection(that.executionCollection.where({
                    ownerId: app.user.get('_id')
                }));

                var jobIds = _.uniq(that.excsCollection.pluck('jobId'));

                _.each(jobIds, function(id) {
                    var excs = _.each(that.excsCollection.where({
                        jobId: id
                    }), function(item) {
                        item.set({
                            status: that.getPanelClass(that.statusCollection.get(item.get('statusId')).get('name')),
                            icon: that.getPanelIcon(that.statusCollection.get(item.get('statusId')).get('name'))
                        });
                    });

                    var j = that.jobCollection.get(id);

                    if (j !== undefined) {
                        j.set({
                            idAttribute: '_id',
                            executions: excs,
                            status: that.getPanelClass(that.statusCollection.get(excs.reverse()[0].get('statusId')).get('name')),
                            icon: that.getPanelIcon(that.statusCollection.get(excs.reverse()[0].get('statusId')).get('name')),
                            scriptName: that.scriptCollection.get(j.get('scriptId')).get('name'),
                            date: moment(j.get('updatedAt')).format('MMM Do YYYY, h:mm:ss a'),
                            oldBox: that.boxCollection.get(j.get('oldBoxId')).get('url'),
                            newBox: that.boxCollection.get(j.get('newBoxId')).get('url')
                        });
                        
                        that.listenTo(j, 'change', that.render.bind(that));

                        that.myjobs.push(j);
                    }
                });

                console.log('From Jobs: ', that.myjobs);

                return B.resolve(that.myjobs);
            });
    };

    Page.prototype.createPanels = function(data) {
        var view = this.$el.find('.panel-container');
        _.each(data, function(model) {

            var panel = new Panel({
                model: model,
                el: view
            });

            panel.render();
        });
    };

    Page.prototype.render = function() {
        var that = this;
        that.getData()
            .then(function() {
                that.$el.html(MAIN({
                    id: that.id
                }));

                var view = $('.panel-container');
                
                _.each(that.myjobs.models, function(model) {
                    //that.myjobs.each(function(model) {
                    var panel = new Panel({
                        model: model,
                        el: view
                    });
                    
                    that.listenTo(model, 'change', panel.render.bind(that));

                    panel.render();
                });

                that.mapControls();
            })
            .then(function() {

                var events = {};
                // events['click .run-btn'] = 'onRunClickHandler';
                that.myjobs.each(function(model) {
                    events['click .run-btn-' + model.get('_id')] = 'onRunClickHandler';
                    events['click .job-delete-btn-' + model.get('_id')] = 'deleteButtonClickHandler';
                    events['click .job-checkbox-' + model.get('_id')] = 'onCheckboxClickHandler';
                });

                events['click .run-all-btn'] = 'onRunAllClickHandler';

                that.delegateEvents(events);
            })
            .finally(function() {
                console.log(that);
                that.ready();
            });
    };

    Page.prototype.onCheckboxClickHandler = function(event) {
        event.stopPropagation();
        
        var runAllBtn = $('.run-all-btn');
        var numChecked = $('.job-checkbox:checked').length;

        if (numChecked > 1) {
            runAllBtn.removeAttr('disabled');
        }
        else {
            runAllBtn.attr('disabled', 'disabled');
        }
    };

    Page.prototype.onRunClickHandler = function(event) {
        var that = this;

        event.preventDefault();

        var id = $(event.target).data('id');

        var execution = new Execution({
            jobId: id,
            statusId: ExecutionStatus.ID_SCHEDULED,
            ownerId: app.user.get('_id') || ''
        });

        return B.resolve(execution.save())
            .then(function(data) {
                // add execution to proper job model
                var j = that.myjobs.get(data.jobId);

                j.get('executions').unshift(execution);

                console.log('just pushed data to collection');
                //that.toast.success('Job has been scheduled to run.');
                //that.goTo('#index/view/id/' + execution.id);
            });
    };

    Page.prototype.onRunAllClickHandler = function(event) {
        var that = this;
        var excs = [];

        event.preventDefault();

        var excsToRun = $('.job-checkbox:checked');

        _.each(excsToRun, function(job) {
            var thisExc = new Execution({
                jobId: job.attributes.name.nodeValue,
                statusId: ExecutionStatus.ID_SCHEDULED,
                ownerId: app.user.get('_id') || ''
            });

            excs.push(thisExc.save());
        });

        return B.all(excs)
            .then(function() {
                that.toast.success('All executions have been scheduled to run.');
            });

        // var id = $(event.target).data('id');

        // var execution = new Execution({
        //     jobId: id,
        //     statusId: ExecutionStatus.ID_SCHEDULED,
        //     ownerId: app.user.get('_id') || ''
        // });

        // return B.resolve(execution.save())
        //     .then(function(data) {
        //         that.toast.success('Job has been scheduled to run.');
        //         //that.goTo('#index/view/id/' + execution.id);
        //     });
    };

    Page.prototype.deleteButtonClickHandler = function(event) {
        var that = this;
        var id = $(event.target).data('id');

        event.preventDefault();

        var job = that.jobCollection.get(id);


        var confirmDlg = new Dialog({
            body: 'Are you sure you want to delete this job?',
            buttons: [{
                id: 'yes',
                label: "Yes. I'm sure.",
                iconClass: 'fa fa-check',
                buttonClass: 'btn-danger'
            }, {
                id: 'no',
                label: 'Nope!',
                iconClass: 'fa fa-times',
                buttonClass: 'btn-default',
                autoClose: true
            }]
        });
        confirmDlg.on('yes', function() {
            B.resolve()
                .then(function() {
                    NProgress.start();
                })
                .then(function() {
                    return job.destroy();
                })
                .then(function() {
                    that.toast.success('Job has been deleted successfully.');
                    confirmDlg.close();
                    that.goTo('job/new'); //if already here then just render or something!!!!!!!!
                })
                .catch(that.error.bind(that))
                .finally(function() {
                    NProgress.done();
                });
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