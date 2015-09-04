var path = require('path'),
    expressIO = require('express.io'),
    express = require('express'),
    exphbs = require('express-handlebars'),
    env = process.env.NODE_ENV || 'development',
    _ = require('underscore'),
    _s = require('underscore.string'),
    config = require('./config/config')[env],
    B = require('bluebird'),
    colors = require('colors'),
    logger = require('./components/logger/logger'),
    odm = require('./components/odm/odm'),
    Agenda = require('./components/agenda/agenda'),
    executionCtrl = require('./api/execution/execution.controller');

var app = expressIO().http().io();
var agenda = new Agenda(app);
    
B.all([odm.initialize()])
    .then(function() {
        var seed = false;

        if (seed) {
            require('./seed');
        }
        
        executionCtrl.terminateRunningExecutions();
        
        app.use('/resources', express.static(path.join(__dirname, '../app/dist'), {
            // maxAge: 86400000
        }));
        app.use('/screenshots', express.static(path.join(__dirname, '../data/executions'), {
            // maxAge: 86400000
        }));
        
        app.use(express.favicon());
        app.use(express.compress());  
        app.use(express.json());  
        app.use(express.urlencoded());  
        app.use(express.methodOverride());
        app.use(express.cookieParser());
        app.use(express.session({secret: 'something-secret-shhhhhhh'}));
        
        app.set('views', path.normalize(__dirname + '/views'));
        app.engine('hbs', exphbs({
            defaultLayout: false,
            extname: '.hbs'
        }));
        app.set('view engine', 'hbs');
        
        app.use(app.router);

        require('./routes')(app);
        
        var port = process.env.PORT || 5000;
        var server = app.listen(port, process.env.IP, function() {
            logger.info(_s.repeat('=', 80).red);
            logger.info('Server is listening at %s, port: %d', server.address().address, server.address().port);
            
        });
        
        agenda.start();
    });