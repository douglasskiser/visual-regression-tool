/*global _, _s*/
define(function(require) {
    var Super = require('views/page/view'),
        B = require('bluebird'),
        Model = require('models/execution'),
        Type = require('models/job-type'),
        Script = require('models/script'),
        Box = require('models/box'),
        Job = require('models/job'),
        Status = require('models/execution-status'),
        Device = require('models/device'),
        ExecutionStatus = require('models/execution-status'),
        FIELDS = require('hbs!./view/fields.tpl'),
        BUTTONS = require('hbs!./view/buttons.tpl');


    var Page = Super.extend({});

    Page.prototype.getModelClass = function() {
        return Model;
    };


    Page.prototype.getFieldsTemplate = function() {
        return FIELDS;
    };

    Page.prototype.fetch = function() {
        var that = this;

        return B.resolve(that.model.fetch())
            .then(function(){
                that.job = new Job({
                    id: that.model.get('jobId')
                });
                that.status = new Status({
                    id: that.model.get('statusId')
                })
                return B.all([that.job.fetch(), that.status.fetch()]);
            })
            .then(function() {
                that.type = new Type({
                    id: that.job.get('typeId')
                });

                that.oldBox = new Box({
                    id: that.job.get('oldBoxId')
                });

                if (that.job.get('typeId') == Type.ID_VISUAL_REGRESSION) {
                    that.newBox = new Box({
                        id: that.job.get('newBoxId')
                    });
                    
                    that.device = new Device({
                        id: that.job.get('deviceId')
                    });
                }

                that.script = new Script({
                    id: that.job.get('scriptId')
                });

                return B.all([that.type.fetch(), that.oldBox.fetch(), (function(){
                    if (that.job.get('typeId') == Type.ID_VISUAL_REGRESSION) {
                        return B.all([that.newBox.fetch(), that.device.fetch()]);
                    }
                    return B.resolve();
                })()]);
            });
    };

    Page.prototype.getPageName = function() {
        return 'Execution';
    };



    // Page.prototype.getFieldsTemplate = function() {
    //     return FIELDS;
    // };


    // Page.prototype.getButtonsHtml = function(data) {
    //     var that = this;
    //     var template = that.getButtonsTemplate();

    //     return template({
    //         id: that.id,
    //         data: data
    //     });
    // };

    Page.prototype.getButtonsTemplate = function() {
        return BUTTONS;
    };

    // Page.prototype.initializeEvents = function() {
    //     var that = this;
    //     var events = {};
    //     events['click ' + that.toId('back')] = 'backButtonClickHandler';
    //     _.extend(events, that.getExtraEvents());
    //     that.delegateEvents(events);
    // };

    // Page.prototype.getExtraEvents = function() {

    // };

 Page.prototype.postRender = function() {
        var that = this;
        that.on('status-change', that.onStatusChangeHandler.bind(that));
        that.renderResults();
        _.delay(that.checkStatus.bind(that), 5000);
    };

    Page.prototype.checkStatus = function() {
        var that = this;
        var statusBefore = that.model.get('statusId');
        if (that.model.get('statusId') == ExecutionStatus.ID_SCHEDULED || that.model.get('statusId') == ExecutionStatus.ID_RUNNING) {
            B.resolve(that.model.fetch())
                .then(function() {
                    if (that.model.get('statusId') != statusBefore) {
                        that.trigger('status-change');
                    }
                    else {
                        that.checkStatusTimeoutHandler = _.delay(that.checkStatus.bind(that), 5000);
                    }
                });
        }
    };

    Page.prototype.renderResults = function() {
        var that = this;
        console.log(that.model.toJSON());
    };

    Page.prototype.onStatusChangeHandler = function() {
        var that = this;
        that.renderResults();
    };

    Page.prototype.cleanUp = function() {
        var that = this;
        if (that.checkStatusTimeoutHandler) {
            window.clearTimeout(that.checkStatusTimeoutHandler);
        }
        Super.prototype.cleanUp.call(that);
    };
    
    Page.prototype.prepareForOutput = function() {
        var that = this;
        return _.extend(that.model.toJSON(), {
            job: that.job.toJSON(),
            type: that.type.toJSON(),
            oldBox: that.oldBox.toJSON(),
            newBox: that.job.get('typeId') == Type.ID_VISUAL_REGRESSION ? that.newBox.toJSON(): undefined,
            script: that.script.toJSON(),
            device: that.device.toJSON(),
            status: that.status.toJSON()
        });
    };

    return Page;


});