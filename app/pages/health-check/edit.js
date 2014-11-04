/*global _, _s, ace*/
define(function(require) {
    var Super = require('views/page/edit'),
        B = require('bluebird'),
        // NProgress = require('nprogress'),
        BoxCollection = require('collections/box'),
        FIELDS = require('hbs!./edit/fields.tpl'),
        Select2 = require('select2'),
        Model = require('models/health-check'),
        Ace = require('ace');

    // Ladda = require('ladda')
    // Template = require('hbs!./edit.tpl');

    var Page = Super.extend({});

    Page.prototype.getPageName = function() {
        return 'Health Check Item';
    };

    Page.prototype.getModelClass = function() {
        return Model;
    };

    Page.prototype.getFieldsTemplate = function() {
        return FIELDS;
    };

    Page.prototype.preRender = function() {
        var that = this;
        that.boxCollection = new BoxCollection();
        return B.all([that.boxCollection.fetch(),
                (function() {
                    if (that.model.isNew()) {

                        return B.resolve(that.socket.request({
                                url: '/health-check/template'
                            }))
                            .then(function(resp) {
                                that.model.set('script', resp);
                            });
                    }
                    return B.resolve();
                })()])
            .then(function() {
                if (that.model.isNew()) {
                    that.model.set('boxId', that.boxCollection.at(0).id);
                }
            });
    };


    Page.prototype.postRender = function() {
        var that = this;
        that.boxCollection.toDropdown(that.controls.boxId, {
            placeholder: 'Select a box'
        });

        that.editor = ace.edit(that.controls.script.get(0));
        that.editor.setTheme("ace/theme/monokai");
        that.editor.getSession().setMode("ace/mode/javascript");
    };
    
    Page.prototype.serialize = function(){
        var data = Super.prototype.serialize.call(this);
        data.script = this.editor.getValue();
        return data;
    }

    return Page;


});