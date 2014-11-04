/*
 * GET home page.
 */

module.exports = function (app) {
    var controller = app.controllers.healthCheck;
    app.get('/health-check/template', controller.template);
};