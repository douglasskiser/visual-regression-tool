var controller = require('./image-compare.controller');

module.exports = function(app) {
    app.get('/rest/image-compare/compare', controller.compare);
    app.get('/rest/image-compare/view', controller.view);
    
    return app;
};