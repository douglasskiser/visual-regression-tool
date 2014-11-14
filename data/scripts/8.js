var screenWidth = 360,
    screenHeight = 640,
    fs = require('fs'),
    casper = require('casper').create({
        logLevel: 'info',
        // verbose: true,
        waitTimeout: 30000,
        pageSettings: {
            webSecurityEnabled: false,
            loadImages: true,
            loadPlugins: false
        },
        //nexus 5
        viewportSize: {
            width: screenWidth,
            height: screenHeight
        }
    }),
    screenshotsPath = ((casper.cli.options || {}).target || '/tmp'),
    startUrl = casper.cli.options.url,
    // reporter = casper.cli.options.reporter,
    screenshotsCount = 0;


function captureSelector(name, selector) {
    screenshotsCount++;
    var fileName = screenshotsCount + '-' + name + '.png';
    var absPath = [screenshotsPath, fileName].join('/');
    casper.echo("Capturing screenshot " + absPath);
    casper.captureSelector(absPath, selector || '#app-container');
};

casper.on('resource.error', function(e) {
    console.log(JSON.stringify(e));
});

casper.echo("Start requesting " + startUrl);

casper.start(startUrl);

casper.viewport(casper.cli.options.width || screenWidth, casper.cli.options.height || screenHeight);

casper.waitFor(function() {
    return casper.evaluate(function() {
        return !$('#loading').is(':visible') && !$('#overlay').is(':visible') && $('#search-flights').is(':visible') && $('#departure-airport>option').size() > 0;
    });
});

casper.wait(5000);

casper.then(function() {
    captureSelector('Air Search Page');
});

casper.then(function() {
    casper.evaluate(function() {
        var e = $('#departure-airport');
        e.val('AUH');
        e.change();
    });
});

casper.waitFor(function() {
    return casper.evaluate(function() {
        return !$('#loading').is(':visible') && !$('#overlay').is(':visible') && $('#arrival-airport').find('option').size() > 1;
    })
});

casper.then(function() {
    captureSelector('Air Search Page - Departure Airport selected');
});

casper.then(function() {
    casper.echo("Set the arrival airport to be the first item in the list'");
    casper.evaluate(function() {
        var arrivalAirport = $('#arrival-airport');
        arrivalAirport.val($(arrivalAirport.find('option')[1]).attr('value'));
    });
});

casper.then(function() {
    captureSelector('Air Search Page - Arrival Airport selected');
});


casper.then(function() {
    casper.echo("Set departure and arrival date click 'Search for Flights'");
    casper.evaluate(function() {
        var arrivalAirport = $('#arrival-airport');
        arrivalAirport.val($(arrivalAirport.find('option')[1]).attr('value'));
        //setting the dates
        $('#departure-date').val('2014/12/10');
        $('#return-date').val('2014/12/31');
        $('#search-flights').click();
    });
});
/*******************/

casper.run(function() {
    casper.echo("CASPER COMPLETED.");
    casper.exit();
});