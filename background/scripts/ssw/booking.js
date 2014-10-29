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
    // var cmd = [reporter, '--command=screenshot', '--file=' + fileName, '--name=' + encodeURIComponent(name)];
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


casper.waitFor(function() {
    return casper.evaluate(function() {
        return !$('#loading').is(':visible') && !$('#overlay').is(':visible') && document.title === 'Air Select Page';
    })
});


casper.then(function() {
    casper.echo('Select the first OUTBOUND flight');
    casper.evaluate(function() {
        $($('.d-outbound .choose-flight')[0]).click();
    });
});

casper.wait(10000);

casper.then(function() {
    captureSelector('Air Select Page - Outbound flight selected');

});

casper.then(function() {
    casper.echo('Select the first class of service for OUTBOUND flight');
    casper.evaluate(function() {
        $($('.d-outbound .select-flight')[0]).click();
    });
});

casper.wait(10000);

casper.then(function() {
    captureSelector('Air Select Page - Selected Outbound Class of Service');

});

casper.then(function() {
    casper.echo('Select the first INBOUND flight');
    casper.evaluate(function() {
        $($('.d-inbound .choose-flight')[0]).click();
    });
});

casper.wait(10000);

casper.then(function() {
    captureSelector('Air Select Page - Inbound Flight selected');

});

casper.then(function() {
    casper.echo('Select the first class of service for INBOUND flight');
    casper.evaluate(function() {
        $($('.d-inbound .select-flight')[0]).click();
    });
});

casper.wait(10000);

casper.then(function() {
    captureSelector('Air Select Page - Selected Inbound Class of Service');

});


casper.then(function() {
    casper.echo('Click on "Purchase Flight"');
    casper.evaluate(function() {
        $('#confirmFlights').click();
    });
});

casper.waitFor(function() {
    return casper.evaluate(function() {
        return !$('#loading').is(':visible') && !$('#overlay').is(':visible') && document.title === 'Passengers Page';
    })
});

casper.then(function() {
    captureSelector('Passengers Page - Home');
});

casper.then(function() {
    casper.echo('Fill passengers username and password and click login');
    casper.evaluate(function() {
        $('.psng-section .loginForm [name=username]').val('100104793095');
        $('.psng-section .loginForm [name=password]').val('awPTCesx');
        $('.psng-section .loginForm #login').click();
    });
});

casper.waitFor(function() {
    return casper.evaluate(function() {
        return $('[data-translate="label.login.youAreSignedInAs"]').size() > 0;
    })
});

casper.then(function() {
    captureSelector('Passengers Page - Signed In');
});


casper.then(function() {
    casper.echo('Click on "Add Details" link');
    casper.evaluate(function() {
        $('.show-psng-form').click();
    });
});
casper.wait(10000);
casper.then(function() {
    captureSelector('Passengers Page - Passenger details form');
});



casper.then(function() {
    casper.echo('Fill the passenger form and click "Save"');
    casper.evaluate(function() {
        $('.field-firstName').val('John');
        $('.field-lastName').val('Doe');
        $('.field-dob').val('1944-07-31');
        $('.field-phone').val('8171112222');
        $('.field-email').val('test@testsabre.com');
        $('.save-psng').click();
    });
});
casper.wait(10000);
casper.then(function() {
    captureSelector('Passengers Page - Passenger details added');
});

casper.then(function() {
    casper.echo('Click on "Continue"');
    casper.evaluate(function() {
        $('.psng-section .btn-primary').click()
    });
});
casper.waitFor(function() {
    return casper.evaluate(function() {
        return !$('#loading').is(':visible') && !$('#overlay').is(':visible') && document.title === 'Ancillary Page';
    });
});
casper.wait(5000);
casper.then(function() {
    captureSelector('Ancillary Page - Home');
});


casper.run(function() {
    casper.echo("CASPER COMPLETED.");
    casper.exit();
});