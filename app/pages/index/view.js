/*global _, _s, app*/
define(function(require) {
    var Super = require('views/page/view'),
        B = require('bluebird'),
        Model = require('models/execution'),
        Type = require('models/job-type'),
        Script = require('models/script'),
        Box = require('models/box'),
        Job = require('models/job'),
        Status = require('models/execution-status'),
        StatusCollection = require('collections/execution-status'),
        Device = require('models/device'),
        ExecutionStatus = require('models/execution-status'),
        VisualRegression = require('./view/visual-regression'),
        ChangesModerator = require('./view/changes-moderator'),
        FIELDS = require('hbs!./view/fields.tpl'),
        BUTTONS = require('hbs!./view/buttons.tpl'),
        TEMPLATE = require('hbs!./view.tpl');


    var Page = Super.extend({});

    Page.prototype.getModelClass = function() {
        return Model;
    };

    Page.prototype.getTemplate = function() {
        return TEMPLATE;
    };


    Page.prototype.getFieldsTemplate = function() {
        return FIELDS;
    };

    Page.prototype.fetch = function() {
        var that = this;

        return B.resolve(that.model.fetch())
            .then(function() {
                that.job = new Job({
                    _id: that.model.get('jobId')
                });
                that.statuses = new StatusCollection({})
                return B.all([that.job.fetch(), that.statuses.fetch()]);
            })
            .then(function() {
                that.type = new Type({
                    _id: that.job.get('typeId')
                });

                that.oldBox = new Box({
                    _id: that.job.get('oldBoxId')
                });

                that.device = new Device({
                    _id: that.job.get('deviceId')
                });

                if (that.job.get('typeId') == Type.ID_VISUAL_REGRESSION) {
                    that.newBox = new Box({
                        _id: that.job.get('newBoxId')
                    });
                }

                that.script = new Script({
                    _id: that.job.get('scriptId')
                });

                return B.all([that.script.fetch(), that.type.fetch(), that.oldBox.fetch(), that.device.fetch(), (function() {
                    if (that.job.get('typeId') == Type.ID_VISUAL_REGRESSION) {
                        return B.all([that.newBox.fetch()]);
                    }
                    return B.resolve();
                })()]);
            });
    };

    Page.prototype.getPageName = function() {
        return 'Execution #' + this.model.id;
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

    Page.prototype.getExtraEvents = function() {
        var that = this;
        var events = {};
        events['click ' + that.toId('rerun')] = 'rerunButtonClickHandler';
        events['click ' + that.toId('download-all')] = 'downloadAllButtonClickHandler';
        events['click ' + that.toClass('download')] = 'downloadButtonClickHandler';
        events['click ' + that.toId('different-only')] = 'differentOnlyClickHandler';
        events['click ' + that.toClass('screenshot')] = 'onScreenshotClickHandler';
        return events;
    };

    Page.prototype.postRender = function() {
        var that = this;
        that.createSocketListener.call(this);
        that.on('status-change', that.onStatusChangeHandler.bind(that));
        that.renderResults();
        that.adjustButtons();
        that.renderStatus();
        //_.delay(that.checkStatus.bind(that), 5000);
    };

    Page.prototype.adjustButtons = function() {
        var that = this;

        if (_.contains([ExecutionStatus.ID_COMPLETED, ExecutionStatus.ID_ERROR, ExecutionStatus.ID_TERMINATED], that.model.get('statusId'))) {
            that.controls.rerun.removeClass('hidden');
        }
        else {
            that.controls.rerun.addClass('hidden');
        }

        if (_.contains([ExecutionStatus.ID_RUNNING], that.model.get('statusId'))) {
            that.controls.delete.addClass('hidden');
        }
        else {
            that.controls.delete.removeClass('hidden');
        }

    };


    Page.prototype.checkStatus = function() {
        var that = this;
        var statusBefore = that.model.get('statusId');
        if (that.model.get('statusId') == ExecutionStatus.ID_SCHEDULED || that.model.get('statusId') == ExecutionStatus.ID_RUNNING) {
            B.resolve(that.model.fetch())
                .then(function() {
                    if (that.model.get('statusId') != statusBefore) {
                        console.log('status changed');
                        that.trigger('status-change');
                    }

                    that.checkStatusTimeoutHandler = _.delay(that.checkStatus.bind(that), 5000);

                });
        }
    };

    Page.prototype.renderResults = function() {
        var that = this,
            Result;
    
        if (that.job.get('typeId') == Type.ID_VISUAL_REGRESSION) {
            Result = VisualRegression;
        }
        else {
            Result = ChangesModerator;
        }

        that.children.result = new Result({
            el: that.controls.result,
            model: that.model,
            device: that.device,
            job: that.job
        });

        that.children.result.render();

    };

    Page.prototype.renderStatus = function() {
        var that = this;
        var status = that.statuses.get(that.model.get('statusId'));
        console.log('STATUS: ', status);
        // var status = that.statuses.get(that.model.attributes[0].statusId);

        that.controls.statusId.html(status.toHTML());

    };

    Page.prototype.onStatusChangeHandler = function() {
        var that = this;
        that.adjustButtons();
        that.renderStatus();
        that.children.result.draw();
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
            newBox: that.job.get('typeId') == Type.ID_VISUAL_REGRESSION ? that.newBox.toJSON() : undefined,
            script: that.script.toJSON(),
            device: that.device ? that.device.toJSON() : {}
        });
    };

    Page.prototype.rerunButtonClickHandler = function(event) {
        var that = this;
        event.preventDefault();
        console.log('rerun clicked');
        B.resolve()
            .then(function() {
                return that.model.save({
                    statusId: ExecutionStatus.ID_SCHEDULED
                }, {
                    wait: true,
                    patch: true
                });
            })
            .then(function() {
                that.toast.success('The execution has been scheduled.');
                that.trigger('status-change');
                _.delay(that.checkStatus.bind(that), 5000);
            });
    };
    
    Page.prototype.createSocketListener = function() {
        app.webSocket.on('data:execution:status', this.onSocketHandler.bind(this));
    };

    Page.prototype.onSocketHandler = function(data) {
        this.model.set({
            statusId: data.statusId
        });
        this.onStatusChangeHandler.call(this);
    };

    return Page;



});