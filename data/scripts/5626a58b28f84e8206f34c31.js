var casper = require('casper').create({
        logLevel: 'info',
        waitTimeout: 30000,
        pageSettings: {
            webSecurityEnabled: false,
            loadImages: true,
            loadPlugins: false
        }
    }),
    Camera = new require('../../camera'),
    camera = new Camera(casper, casper.cli.options.target),
    startUrl = casper.cli.options.url;

casper.echo("Start requesting " + startUrl);
casper.start(startUrl);
casper.viewport(casper.cli.options.width, casper.cli.options.height);

casper.then(function() {
	casper.evaluate(function() {
		window.departureAirport = 'BKK';
		window.arrivalAirport = 'SIN';
		window.prefix = 'MR';
		window.prefixVal = 'Mr.';
		window.firstName = 'john';
		window.lastName = 'Doe';
		window.phoneNumber = '8179325799';
		window.email = 'email@email.com';
		window.dob = '1990-12-12';
		window.creditCardNo = 4111111111111111;
		window.nameOnCard = 'John Doe';
		window.cvcNumber = 123;
		window.street1 = "904 Greek Row Dr";
		window.street2 ='Apt 222';
		window.city = "Arlington";
		window.province = 'TX';
		window.zipCode = 76010;
		window.country = 'US';
		window.cardMonth = '01';
		window.cardYear = 2018;

		window.isLoadingHidden = function() {
			return !$('#loading').is(':visible') && !$('#overlay').is(':visible');
		};

		window.isInPage = function(pageName) {
			return $('body').hasClass(pageName);
		};
	});
});

casper.waitFor(function() {
	return casper.evaluate(function() {
		return window.isLoadingHidden() && window.isInPage('AIR_SEARCH_PAGE');
	});
}, function then() {}, function timeout() {}, 30000);


casper.then(function() {
    camera.capture('#app-container', 'Air Search Page');
});

casper.then(function() {
	casper.evaluate(function() {
		var tomorrowDate = new Date();
		tomorrowDate.setDate(tomorrowDate.getDate()+2);
		var date = tomorrowDate.getFullYear() + "/" + (tomorrowDate.getMonth() + 1) + "/" + tomorrowDate.getDate();
		$('#departure-date').val(date);
		var tomorrowDate1 = new Date();
		tomorrowDate1.setDate(tomorrowDate1.getDate()+5);
		var date1 = tomorrowDate1.getFullYear() + "/" + (tomorrowDate1.getMonth() + 1) + "/" + tomorrowDate1.getDate();
		$('#return-date').val(date1);
		window.departureDate = date;
		window.returnDate = date1;
	});
});

casper.then(function() {
	casper.evaluate(function() {
		$('#departure-airport').val(window.departureAirport);
		$('#departure-airport').change();
	});
});

casper.waitFor(function() {
		return casper.evaluate(function() {
			return window.isLoadingHidden() && $('#arrival-airport>option').size() > 0;
		});
}, function then() {}, function timeout() {}, 30000);

casper.then(function() {
    camera.capture('#app-container', 'Air Search Page - Departure Airport selected');
});

casper.then(function() {
	casper.evaluate(function() {
		$("#arrival-airport").val(window.arrivalAirport);
		$("#arrival-airport").change();
	});
	
	casper.wait(500);
	
	casper.then(function() {
        camera.capture('#app-container', 'Air Search Page - Arrival Airport selected');
    });

	casper.evaluate(function() {
		$('#continue').trigger('click');
	});
});

casper.waitFor(function() {
	return casper.evaluate(function() {
		return window.isLoadingHidden() && window.isInPage('AIR_SEARCH_PAGE') && $('[data-translate="label.flc.noFlightsHeader"]').size() > 0;
	});
}, function then() {}, function timeout() {}, 30000);


casper.then(function () {
	var noFlights = this.evaluate(function () {
		return $('[data-translate="label.flc.noFlightsHeader"]').size() > 0 ||
			   $('[data-translate="flow.message.noFlightsAvailableOutbound.message"]').size() > 0 ||
			   $('[data-translate="flow.message.noFlightsAvailableInbound.message"]').size() > 0;
	});

	if(noFlights) {
		test.assertEval(function() {
			return $('[data-translate="label.flc.noFlightsHeader"]').size() > 0 ||
			   $('[data-translate="flow.message.noFlightsAvailableOutbound.message"]').size() > 0 ||
			   $('[data-translate="flow.message.noFlightsAvailableInbound.message"]').size() > 0;
		}, 'No flights were found for the route BKK to SIN');

		casper.exit();
	}
});

casper.run(function() {
    casper.echo("CASPER COMPLETED.");
    casper.exit();
});