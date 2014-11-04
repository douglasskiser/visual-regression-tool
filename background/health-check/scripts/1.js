var Utils = require('../utils'),
    startUrl = casper.cli.options.url,
    casper = require('casper').create({
        logLevel: 'info',
        waitTimeout: 30000,
        pageSettings: {
            webSecurityEnabled: false,
            loadImages: true,
            loadPlugins: false
        }
    });

//on resource.error, call error reporting and exit
casper.on('resource.error', function(e) {
    Utils.handleError(e);
    casper.exit();
});

//start casper
casper.start(startUrl);

/********************** YOUR SCRIPT STARTS HERE *******************************/
casper.waitFor(function() {
    return casper.evaluate(function() {
        return !$('#loading').is(':visible') && !$('#overlay').is(':visible') && $('#search-flights').is(':visible') && $('#departure-airport>option').size() > 0;
    });
});

casper.then(function() {
    casper.evaluate(function() {
        var e = $('#departure-airport');
        e.val('AUH');
        e.change();
    });
});
/********************** YOUR SCRIPT ENDS HERE *******************************/
casper.run(function() {
    Utils.handleSuccess();
    casper.exit();
});