/*
 * GET home page.
 */

module.exports = function (app) {
    var controller = app.controllers.versionComparison;

    app.get('/version-comparison/request-execution-id', controller.requestExecutionId);
    app.post('/version-comparison/run/execution-id/:executionId', controller.run);
    app.get('/version-comparison/screenshots/execution-id/:executionId', controller.screenshots);

};