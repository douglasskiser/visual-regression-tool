var env = process.env.NODE_ENV || 'development',
    config = require('./config/config')[env],
    pkg = require('../package.json');

module.exports = function(app) {
    app.all('/', function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      next();
     });
     
    app.get('/', function(req, res) {
        res.render('home', {
            path: ['resources', pkg.version].join('/'),
            // path: ['//development.vrt.divshot.io', pkg.version].join('/'),
            pkg: pkg,
            config: config
        });
    });
    
    // HTTP Routes
    require('./api/box')(app);
    require('./api/device')(app);
    require('./api/job')(app);
    require('./api/job-type')(app);
    require('./api/script')(app);
    require('./api/execution')(app);
    require('./api/health-check')(app);
    
    // Web Socket Routes
    app.io.route('box', require('./api/box/box.socket')(app));
    app.io.route('device', require('./api/device/device.socket')(app));
    app.io.route('job', require('./api/job/job.socket')(app));
    app.io.route('jobtype', require('./api/job-type/job-type.socket')(app));
    app.io.route('script', require('./api/script/script.socket')(app));
    app.io.route('execution', require('./api/execution/execution.socket')(app));
    app.io.route('healthcheck', require('./api/health-check/health-check.socket')(app));
};