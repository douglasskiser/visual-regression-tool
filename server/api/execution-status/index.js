var controller = require('./execution-status.controller');

module.exports = function(app) {
    app.get('/rest/execution-status', controller.get);
    
    return app;
};