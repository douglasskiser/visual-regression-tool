var env = process.env.NODE_ENV || 'development',
    config = require('./config')[env],
    pkg = require('./package.json');

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
};