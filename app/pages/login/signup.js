/*global _, _s, app*/
define(function(require) {
    var Super = require('views/page'),
        B = require('bluebird'),
        MAIN = require('hbs!./signup.tpl'),
        User = require('models/user');

    var Page = Super.extend({});

    Page.prototype.initialize = function(options) {
        var that = this;

        Super.prototype.initialize.call(that, options);
    };

    Page.prototype.render = function() {
        var that = this;

        that.$el.html(MAIN({
            id: that.id
        }));
        that.mapControls();

        var events = {};

        events['click .signup-submit'] = 'onSubmitClick';
        
        that.delegateEvents(events);

        return Super.prototype.render.call(that);
    };
    
    Page.prototype.onSubmitClick = function(event) {
        event.preventDefault();
        
        var that = this;
        var email = that.controls.username.val().trim();
        var pass = that.controls.password.val().trim();
        var confirm = that.controls.confirm.val().trim();
        
        if (pass === confirm) {
            return that.signup({
                email: email,
                password: pass
            });
        } else {
            that.toast.error('Password did not match confirmation password.');
        }
    };

    Page.prototype.signup = function(data) {
        var that = this;
        
        var user = new User({
            email: data.email,
            password: data.password
        });
        
        return B.resolve(user.save())
            .then(function(data) {
                that.toast.success('Your account has been created.');
            });
    };

    return Page;


});