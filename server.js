/**
 * Module dependencies.
 */
var path = require('path'),
    express = require('express'),
    exphbs = require('express-handlebars'),
    RedisStore = require('connect-redis')(express),
    env = process.env.NODE_ENV || 'development',
    _ = require('underscore'),
    _s = require('underscore.string'),
    config = require('./config')[env],
    app = express(),
    db = require('./db'),
    Execution = require('./models/execution'),
    Bluebird = require('bluebird'),
    pkg = require('./package.json'),
    load = require('express-load'),
    colors = require('colors'),
    logger = require('./logger');


//when the server restart, all child processes have been killed. Therefore, update their status again
db.knex('Execution').where({
    status: Execution.STATUS_RUNNING
})
.update({
    status: Execution.STATUS_CREATED
})
.then(function(updated){
    logger.info("There are " + updated + " rows affected in Execution table.")
});

app.use(express.compress());
app.use('/resources', express.static(path.join(__dirname, '/app/dist'), {maxAge: 86400000}));
app.use('/screenshots', express.static(path.join(__dirname, '/screenshots'), {maxAge: 86400000}));

//app.use(express.favicon());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());

app.engine('hbs', exphbs({
    defaultLayout: false,
    extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.use(app.router);

app.get('/', function(req, res) {
    res.render('home', {
        path: ['resources',pkg.version].join('/'),
        pkg: pkg,
        config: config
    });
});


load('controllers').then('routes').into(app);

var port = process.env.PORT || 5000;
var server = app.listen(port, process.env.IP, function() {
    logger.info(_s.repeat('=', 80).red);
    logger.info('Server is listening at %s, port: %d', server.address().address, server.address().port);
});
