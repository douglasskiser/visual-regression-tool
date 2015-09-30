/*global _, _s, app*/
define(function(require) {
    var Super = require('views/page'),
        B = require('bluebird'),
        MAIN = require('hbs!./login.tpl'),
        User = require('models/user');

    var Page = Super.extend({});

    Page.prototype.initialize = function(options) {
        var that = this;
        //super(options)
        that.user = new User();
        Super.prototype.initialize.call(that, options);
    };

    Page.prototype.render = function() {
        var that = this;

        that.$el.html(MAIN({
            id: that.id
        }));
        that.mapControls();

        var events = {};
        events['click ' + that.toId('submit')] = 'onSubmitClick';
        events['click .signup'] = 'onSignupClick';
        that.delegateEvents(events);

        return Super.prototype.render.call(that);
    };

    Page.prototype.onSubmitClick = function(event) {
        event.preventDefault();

        var that = this;

        return this.login.call(this, {
            username: that.controls.username.val().trim(),
            password: that.controls.password.val().trim()
        });
    };

    Page.prototype.onSignupClick = function(event) {
        event.preventDefault();

        this.goTo('login/signup', {
            trigger: true,
            replace: true
        });
    };

    Page.prototype.login = function() {
        var that = this;

        B.resolve(this.app.socket.request({
                url: '/auth/local',
                data: {
                    email: that.controls.username.val().trim(),
                    password: that.controls.password.val().trim()
                },
                type: 'POST'
            }))
            .then(function(data) {
                var logoutBtn = $('.logout');
                
                app.cookieStore.set('token', data.token);
                app.token = data.token;


                that.toast.success('You have successfully logged in.');

                if (app.cookieStore && app.cookieStore.get('token')) {
                    B.resolve(this.app.socket.request({
                            url: '/rest/user/me',
                            data: {},
                            type: 'GET',
                            headers: {
                                authorization: 'Bearer ' + app.cookieStore.get('token')
                            }
                        }))
                        .then(function(data) {
                            app.user = new User(data);
                            if (logoutBtn.hasClass('hidden')) {
                                logoutBtn.removeClass('hidden');
                            }
                            that.goTo('job/new', {
                                trigger: true,
                                replace: true
                            });
                        })
                        .catch(function() {
                            // that.toast.error('Incorrect username or password!');
                        });
                }
                else {
                    that.goTo('login/login', {
                        trigger: true,
                        replace: true
                    });
                    B.resolve();
                }
            })
            .catch(function() {
                that.toast.error('Incorrect username or password!');
            });
    };

    return Page;
});