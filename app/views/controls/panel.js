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
        console.log('My Model : ', this.model);
        
        
        this.statusCollection = new StatusCollection();
        this.scriptCollection = new ScriptCollection();
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

    View.prototype.render = function() {
        var that = this;
        
        // that.fetchData().then(function() {
            // that.model.set({
            //     status: that.getPanelClass(that.statusCollection.get(that.model.get('executions').reverse()[0].get('statusId')).get('name')),
            //     icon: that.getPanelIcon(that.statusCollection.get(that.model.get('executions').reverse()[0].get('statusId')).get('name')),
            //     scriptName: that.scriptCollection.get(that.model.get('scriptId')).get('name'),
            //     date: moment(that.model.get('updatedAt')).format('MMM Do YYYY, h:mm:ss a')
            // });
                that.listenTo(that.model, 'change', that.render.bind(that));

                that.$el.append(Template({
                    id: that.id,
                    model: that.model.toJSON(),
                    idAttribute: '_id'
                }));

                that.mapControls();
                //that.renderHead();
                // that.renderBody();

                var events = {};

                events['click .run-btn'] = 'onRunClickHandler';
                events['click .run-all-btn'] = 'onRunAllClickHandler';
                events['click .job-checkbox'] = 'onCheckboxClickHandler';
                events['click .job-delete-btn'] = 'deleteButtonClickHandler';

                that.delegateEvents(events);

                //that.model.on('sync add remove', that.render.bind(that));
                // that.on('sort', that.sortHandler.bind(that));
            // }); 
        // });
    };
    
    // View.prototype.toJSON = function() {
    //     var that = this;
    //     return {
    //         date: that.model.get('date'),
    //         icon: that.model.get('icon'),
    //         status: that.model.get('status'),
    //         model: that.model.get('model'),
    //         executions: that.model.get('executions')
    //     };
    // };

    // View.prototype.getPanels = function() {
    //     return new View.panels();
    // };

    // View.prototype.renderBody = function() {
    //     var that = this;
    //     // that.controls.tbody.html(TBODY({
    //     //     id: that.id,
    //     //     rows: that.collection.map(function(model, index) {
    //     //         return that.tranformRow(model, index);
    //     //     }),
    //     //     columns: that.columns.toJSON()
    //     // }));
    // };


    // View.prototype.getDefaultRenderer = function() {
    //     return function(model, column, rowIndex, columnIndex) {
    //         return model.get(column.id);
    //     };
    // };
    
    // View.prototype.onCheckboxClickHandler = function(event) {
    //     event.stopPropagation();
    //     console.log('hello checkbox');
    //     var runAllBtn = $('.run-all-btn');
    //     var numChecked = $('.job-checkbox:checked').length;
        
    //     if (numChecked > 1) {
    //         runAllBtn.removeClass('hidden');
    //     } else {
    //         runAllBtn.addClass('hidden');
    //     }
    // };
    
    // View.prototype.onRunAllClickHandler = function(event) {
    //     var that = this;
    //     var excs = [];

    //     event.preventDefault();
        
    //     var excsToRun = $('.job-checkbox:checked');
        
    //     $.each(excsToRun, function(i, job) {
    //         var thisExc = new Execution({
    //             jobId: job.attributes.name.nodeValue,
    //             statusId: ExecutionStatus.ID_SCHEDULED,
    //             ownerId: app.user.get('_id') || ''
    //         });
            
    //         excs.push(thisExc.save());
    //     });
        
    //     return B.all(excs)
    //         .then(function() {
    //             that.toast.success('All executions have been scheduled to run.');
    //         });

    //     // var id = $(event.target).data('id');

    //     // var execution = new Execution({
    //     //     jobId: id,
    //     //     statusId: ExecutionStatus.ID_SCHEDULED,
    //     //     ownerId: app.user.get('_id') || ''
    //     // });

    //     // return B.resolve(execution.save())
    //     //     .then(function(data) {
    //     //         that.toast.success('Job has been scheduled to run.');
    //     //         //that.goTo('#index/view/id/' + execution.id);
    //     //     });
    // };
    
    // View.prototype.deleteButtonClickHandler = function(event){
    //     var that = this; 
    //     var id = $(event.target).data('id');
        
    //     event.preventDefault();
        
    //     var job = that.jobCollection.get(id);
        
    //     //get exc by model id and destroy it then rerender perhaps
        
    //     var confirmDlg = new Dialog({
    //         body: 'Are you sure you want to delete this job?',
    //         buttons: [{
    //             id: 'yes',
    //             label: "Yes. I'm sure.",
    //             iconClass: 'fa fa-check',
    //             buttonClass: 'btn-danger'
    //     }, {
    //             id: 'no',
    //             label: 'Nope!',
    //             iconClass: 'fa fa-times',
    //             buttonClass: 'btn-default',
    //             autoClose: true
    //     }]
    //     });
    //     confirmDlg.on('yes', function() {
    //         B.resolve()
    //             .then(function() {
    //                 NProgress.start();
    //             })
    //             .then(function() {
    //                 return job.destroy();
    //             })
    //             .then(function() {
    //                 that.toast.success('Job has been deleted successfully.');
    //                 confirmDlg.close();
    //                 that.goTo('job/new'); //if already here then just render or something!!!!!!!!
    //             })
    //             .catch(that.error.bind(that))
    //             .finally(function() {
    //                 NProgress.done();
    //             });
    //     });
    // };

    return View;


});