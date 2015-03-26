var casper = require('casper').create({
        logLevel: 'debug',
        waitTimeout: 90000,
        pageSettings: {
            webSecurityEnabled: false,
            loadImages: true,
            loadPlugins: false
        }
    }),
    Camera = new require('../../camera'),
    camera = new Camera(casper, casper.cli.options.target),
    x = require('casper').selectXPath,
    startUrl = casper.cli.options.url;

casper.echo("Start requesting" + startUrl);
casper.start(startUrl);
casper.viewport(casper.cli.options.width, casper.cli.options.height);

/*
 *  Hooking into events
 *
 */
 
casper.on('resource.error', function(resource){
    casper.echo(JSON.stringify(resource));
}).on('remote.message', function(message) {
    this.echo('remote.message: ' + message);
}).on('waitFor.timeout', function(details,err){
    casper.echo(details + " -> Time out " + Object.keys(err) + " <-> " + err['testFx']);
}).on('complete.error', function(err) {
    this.die("Complete callback has failed: " + err);
});
// casper.on('log', function(details){
//     casper.echo(JSON.stringify(details));
// });
casper.on("page.error", function(msg, trace) {
    casper.echo("Error: " + msg + "\nTRACE: " + trace, "ERROR");
}).on('error', function(msg, trace){
    casper.echo("Error: " + msg + "\nTRACE: " + trace, "ERROR");
}).on("mouse.click", function(args) {
    casper.echo(" --------------" + JSON.stringify(args));
});


/*
 *                  TEST BEGIN
 *
 */
 
 
casper.waitFor(function() {
    return casper.evaluate(function() {
        return $ && !$('#loading').is(':visible') && !$('#overlay').is(':visible') && $('.flight-status-form').is(':visible');
    });
});

casper.wait(2000);


// remove all animations from the page
casper.then(function() {
     casper.evaluate(function() {
         var style = document.createElement('style');
         style.innerHTML = '* { -webkit-animation-delay: 0.01s !important; -webkit-animation-duration: 0.01s !important; }';
         document.body.appendChild(style);
         
         // set the globals
         // check for URL and change destination accordingly
        if(document.URL.indexOf("EYM0") > -1){
            window.arrivalAirport = "AUH";
            window.departureAirport = "DFW";
        }else if(document.URL.indexOf("PGM0") > -1){
            window.departureAirport = "BKK";
            window.arrivalAirport = "HKG";
        }else if(document.URL.indexOf("KXM0") > -1){
            window.departureAirport = "CYB";
            window.arrivalAirport = "MIA";
        }else if(document.URL.indexOf("WYM0") > -1){
            window.departureAirport = "MCT";
            window.arrivalAirport = "BAH";
        }else if(document.URL.indexOf("VNM0") > -1){
            window.departureAirport = "DFW";
            window.arrivalAirport = "SGN";
        }else if(document.URL.indexOf("3MM0") > -1){
            window.departureAirport = "FLL";
            window.arrivalAirport = "EYW";
        }else if(document.URL.indexOf("KMM0") > -1){
            window.departureAirport = "MLA";
            window.arrivalAirport = "LHR";
        }else if(document.URL.indexOf("B2M0") > -1){
            window.departureAirport = "MSQ";
            window.arrivalAirport = "LGW";
        }else if(document.URL.indexOf("PRM0") > -1){
            window.departureAirport = "MNL";
            window.arrivalAirport = "JOL";
        }else{
            window.departureAirport = "DFW";
            window.arrivalAirport = "DEL";    
        }
     });
});
 
casper.then(function() {
    camera.capture('#app-container', 'Flight Status Airport Landing Page');
});

// click Flight number option
casper.then(function() {
     casper.evaluate(function() {
         $('input[name="search"]').not(':checked').click();
     });
});

casper.waitFor(function() {
    return casper.evaluate(function() {
        return !$('#loading').is(':visible') && !$('#overlay').is(':visible') && $('#flight-number').is(':visible');
    });
});


casper.wait(2000);

casper.then(function() {
    camera.capture('#app-container', 'Flight Status Flight Number Landing Page');
});

// go Back to Airport Search option
casper.then(function() {
     casper.evaluate(function() {
         $('input[name="search"]:first').click();
     });
});

casper.waitFor(function() {
    return casper.evaluate(function() {
        return !$('#loading').is(':visible') && !$('#overlay').is(':visible') && !$('#flight-number').is(':visible');
    });
});

// cick search for flights option without setting values
casper.then(function() {
     casper.evaluate(function() {
         $('#search-btn').click();
     });
});

casper.waitFor(function() {
    return casper.evaluate(function() {
        return !$('#loading').is(':visible') && !$('#overlay').is(':visible') && $('.validation-error').is(':visible');
    });
});

casper.then(function() {
    camera.capture('#app-container', 'Flight Status Required Field Validation Error');
});

// set the departure airport
casper.then(function() {
    casper.evaluate(function() {
        var e = $('#departure-airport');
        e.val(window.departureAirport);
        e.change();
    });
});


casper.waitFor(function() {
    return casper.evaluate(function() {
        return !$('#loading').is(':visible') && !$('#overlay').is(':visible') && $('#arrival-airport').find('option').size() > 1;
    });
});


// set the arrival airport
casper.then(function() {
    casper.evaluate(function() {
        var e = $('#arrival-airport');
        e.val(window.arrivalAirport);
        e.change();
    });
});


// click tomorrow
casper.then(function() {
     casper.evaluate(function() {
         $('input[name="date"]').not(':checked').click();
     });
});

casper.then(function() {
    camera.capture('#app-container', 'Flight Status Values set');
});


// cick search for flights option
casper.then(function() {
     casper.evaluate(function() {
         window.location.href = $('#search-btn').attr('href');
     });
});


casper.waitFor(function() {
    return casper.evaluate(function() {
        return (!$('#loading').is(':visible') && !$('#overlay').is(':visible') && $('#flight-schedule').is(':visible')) || (!$('#loading').is(':visible') && $('#overlay').is(':visible') && $('#modal').is(':visible'));
    });
});


casper.wait(2000);

casper.then(function() {
    camera.capture('#app-container', 'Flight List');
});

// expand the first flight details
casper.then(function() {
     var result = casper.evaluate(function() {
         if($('ul.flights>li').length > 1){
             $('ul.flights li:first .view-flight-status').click();
             return 0;
         }if($('#modal').is(':visible')){
             return 1;
         }
     });
     if(result === 1){
         casper.echo("No Flights Found!!!");
         camera.capture('#app-container', 'No flights found');
         casper.die("Exiting Casper js now....");
     }
});

// wait for flight details to load
casper.waitFor(function() {
    return casper.evaluate(function() {
        if($('ul.flights>li').length > 1){
            return !$('#loading').is(':visible') && !$('#overlay').is(':visible') && !$('ul.flights li:first .details').hasClass('hidden');
        }else{
            return true;
        }
    });
});

casper.then(function() {
     casper.evaluate(function() {
         $('body').children().finish();
     });
});

casper.wait(5000);

casper.then(function() {
    camera.capture('#app-container', 'Flight Status details');
});


casper.run(function() {
    casper.echo("CASPER COMPLETED.");
    casper.exit();
});