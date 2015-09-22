/*global Backbone, _, app*/
define(function(require) {

    var Super = require('views/base'),
        Promise = require('bluebird'),
        User = require('models/user'),
        accounting = require('accounting'),
        Template = require('hbs!./nav.tpl');

    var View = Super.extend({

    });

    View.prototype.initialize = function(options) {
        Super.prototype.initialize.call(this, options);
    };

    View.prototype.render = function() {
        var that = this;
        
        var isLoggedIn = app.user && app.user.get('_id');

        var params = {
            id: this.id,
            appFullName: window.app.config.get('fullName'),
            isNotLoggedIn: !isLoggedIn
        };

        this.$el.html(Template(params));
        this.mapControls();
        var events = {};
        events['click .logout'] = 'onLogoutClick';

        this.delegateEvents(events);

        this.listenTo(window.app, 'page-rendered', this.onPageRendered.bind(this));
    };

    View.prototype.onPageRendered = function(page) {
        var that = this;
        that.controls.items.find('>li').removeClass('active');
        that.controls.items.find('[data-controller=' + page.options.controller + ']').addClass('active');
    };
    
    View.prototype.onLogoutClick = function(event) {
        event.preventDefault();
        
        var that = this;
        
         Promise.resolve(app.socket.request({
            url: '/rest/user/logout',
            type: 'POST'
        }))
        .then(function(data){
            var logoutBtn = $('.logout');
            
            app.user = undefined;
            app.token = undefined;
            app.cookieStore.remove('token');
            
            if (!logoutBtn.hasClass('hidden')) {
                logoutBtn.addClass('hidden');
            }

            app.router.navigate('login/login', {trigger: true, replace: true});
            //that.toast.success('You have successfully logged out.');
        })
        .catch(function(err) {
            if (err) {
                console.log('ERR', err);
            }
            //that.toast.error('Error logging you out!');
        });
    };

    return View;
});