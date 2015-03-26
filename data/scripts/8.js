var casper = require('casper').create({
        logLevel: 'debug',
        waitTimeout: 90000,
        pageSettings: {
            webSecurityEnabled: false,
            loadImages: true,
            loadPlugins: false
        }
    }),
    Camera = require('../../camera'),
    camera = new Camera(casper, casper.cli.options.target),
    x = require('casper').selectXPath,
    startUrl = casper.cli.options.url;

casper.echo("Start requesting" + startUrl);
casper.start(startUrl);
casper.viewport(casper.cli.options.width, casper.cli.options.height);
casper.on('resource.error', function(resource) {
    casper.echo(JSON.stringify(resource));
});

casper.on('remote.message', function(message) {
    this.echo('remote.message: ' + message);
});

casper.on('waitFor.timeout', function(details, err) {
    casper.echo(details + " -> Time out " + Object.keys(err) + " <-> " + err['testFx']);
});
casper.on('complete.error', function(err) {
    this.die("Complete callback has failed: " + err);
});
// casper.on('log', function(details){
//     casper.echo(JSON.stringify(details));
// });
casper.on("page.error", function(msg, trace) {
    casper.echo("Error: " + msg + "\nTRACE: " + trace, "ERROR");
});
casper.on('error', function(msg, trace) {
    casper.echo("Error: " + msg + "\nTRACE: " + trace, "ERROR");
})
casper.on("mouse.click", function(args) {
    casper.echo(" --------------" + JSON.stringify(args));
});


/*
 *                  TEST BEGIN
 *
 */


casper.waitFor(function() {
    return casper.evaluate(function() {
        return window.$ !== undefined && !$('#loading').is(':visible') && !$('#overlay').is(':visible') && $('#departure-airport>option').size() > 0;
    });
});

casper.wait(30000);

// remove all animations from the page
casper.evaluate(function() {
    var style = document.createElement('style');
    style.innerHTML = '* { -webkit-animation-delay: 0.01s !important; -webkit-animation-duration: 0.01s !important; }';
    document.body.appendChild(style);
});

casper.then(function() {
    casper.echo("Make it a one way flight'");
    casper.evaluate(function(a) {
        // set the static values

        // check for URL and change destination accordingly
        if (document.URL.indexOf("EYM0") > -1) {
            window.departureAirport = "DFW";
            window.arrivalAirport = "DEL";
        }
        else if (document.URL.indexOf("PGM0") > -1) {
            window.departureAirport = "BKK";
            window.arrivalAirport = "HKG";
        }
        else if (document.URL.indexOf("KXM0") > -1) {
            window.departureAirport = "LAX";
            window.arrivalAirport = "CYB";
        }
        else if (document.URL.indexOf("WYM0") > -1) {
            window.departureAirport = "MCT";
            window.arrivalAirport = "BAH";
        }
        else if (document.URL.indexOf("VNM0") > -1) {
            window.departureAirport = "DFW";
            window.arrivalAirport = "SGN";
        }
        else {
            window.departureAirport = "DFW";
            window.arrivalAirport = "DEL";
        }

        $('#flight-type-one-way-trip').click();
    })
})

casper.then(function() {
    camera.capture('#app-container', 'Air Search Page');
});

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

casper.then(function() {
    camera.capture('#app-container', 'Air Search Page - Departure Airport selected');
});

// grab arrival airport not set screen shot
casper.then(function() {
    casper.echo("Click on search flights without setting the arrival airport");
    casper.evaluate(function() {
        $('#continue').click();
    });
});

casper.wait(4000);

casper.waitFor(function() {
    return casper.evaluate(function() {
        return $('.error').is(':visible');
    })
});

casper.then(function() {
    camera.capture('#app-container', 'Air Search Page - Arrival Airport Not selected Error');
});

casper.then(function() {
    casper.echo("Set the arrival airport to be the first item in the list'");
    casper.evaluate(function() {
        var arrivalAirport = $('#arrival-airport');
        arrivalAirport.val(window.arrivalAirport);
    });
});

casper.then(function() {
    camera.capture('#app-container', 'Air Search Page - Arrival Airport selected');
});


// set a date before today
casper.then(function() {
    casper.echo("Set departure date to a past date");
    casper.evaluate(function() {
        //setting the dates
        var $today = new Date();
        var $yesterday = new Date($today);
        $yesterday.setDate($today.getDate() - 2);
        $('#departure-date').val($yesterday.getFullYear() + '/' + ($yesterday.getMonth() + 1) + "/" + $yesterday.getDate());
        $('#continue').click();
    });
});

casper.waitFor(function() {
    return casper.evaluate(function() {
        return !$('#loading').is(':visible') && $('#overlay').is(':visible') && $('#modal').is(':visible');
    })
});

casper.wait(2000);

casper.then(function() {
    camera.capture('#app-container', 'Air Search Page - Invalid Date Screen shot');
});

// close the over lay
casper.then(function() {
    casper.echo("Close the invalid date error message overlay");
    casper.evaluate(function() {
        $('#modal .modal-close').click();
    });
});

casper.wait(2000);

casper.then(function() {
    camera.capture('#app-container', 'Air Search Page - Invalid Date Screen shot modal closed');
});


casper.waitFor(function() {
    return casper.evaluate(function() {
        return !$('#loading').is(':visible') && !$('#overlay').is(':visible') && !$('#modal').is(':visible');
    })
});

casper.wait(2000);

casper.then(function() {
    casper.echo("Set departure and arrival date click 'Search for Flights'");
    casper.evaluate(function() {
        // var $today = new Date();
        // var $futureDate = new Date($today);
        // $futureDate.setDate($today.getDate() + 30);
        // $('#departure-date').val($futureDate.getFullYear() + '/' + ($futureDate.getMonth() + 1) + "/" + $futureDate.getDate());
        $('#departure-date').val('2015/06/30')
        $('#continue').click();
    });
});

casper.wait(8000);


casper.waitFor(function() {
    return casper.evaluate(function() {
        return (!$('#loading').is(':visible') && !$('#overlay').is(':visible') && (document.title === 'Air Select Page' || document.title === "Flights Page")) || (!$('#loading').is(':visible') && $('#overlay').is(':visible') && $('#modal').is(':visible'))
    })
});

casper.wait(8000);


// check if we have moved on to the next page or are we still stuck on the first page with an error
casper.then(function() {

    var value = casper.evaluate(function() {
        if (!$('#loading').is(':visible') && $('#overlay').is(':visible') && $('#modal').is(':visible') && (document.title === "Air Search Page" || document.title === "Search Page")) {
            return 1;
        }
        else {
            return 0;
        }
    });

    if (value > 0) {
        // something went wrong. Take a screen shot and kill the process
        casper.echo("Unable to move further");
        camera.capture('#app-container', 'Something Went Wrong');
        casper.die("Exiting Casper js now....");
    }
});


casper.wait(2000);


casper.then(function() {
    casper.echo('Select the first OUTBOUND flight');

    casper.evaluate(function() {
        // make values on page to standard pre difined values to minimize differences
        $('.date span').text('Mon Jan')
        $('.day').text('22');
    });

    camera.capture('#app-container', 'Air Select Page - Outbound flight List');

    casper.evaluate(function() {
        $('.direction-box.d-outbound ul.flights li').first().find('.choose-flight').click();
    });
});

casper.waitFor(function() {
    return casper.evaluate(function() {
        return !$('#loading').is(':visible') && !$('#overlay').is(':visible') && $('#app-container').position().top === 0;
    })
});

casper.wait(15000);

// casper.then(function() {
//     camera.capture('#app-container', 'Air Select Page - Outbound flight selected');

// });

// select flight service class
casper.then(function() {
    casper.evaluate(function() {
        // make values on page to standard pre difined values to minimize differences
        $('.date span').text('Mon Jan')
        $('.day').text('22');
    });
    camera.capture('#app-container', 'Air Select Page - Outbound flight selected');
    casper.echo('Select the first class of service for OUTBOUND flight');
    casper.evaluate(function() {
        $($('.basket .select-flight')[0]).click();
    });
});

casper.wait(10000);

casper.then(function() {
    casper.evaluate(function() {
        // make values on page to standard pre difined values to minimize differences
        $('.date span').text('Mon Jan')
        $('.day').text('22');
    });
    camera.capture('#app-container', 'Air Select Page - Selected Outbound Class of Service');
});


// expand cost break down option
casper.then(function() {
    casper.echo('Expand cost break down option');
    casper.evaluate(function() {
        $('.show-payc-price-details').click();
    });
});

//// check if select flight option is available
casper.waitFor(function() {
    return casper.evaluate(function() {
        return $('.c-price').is(':visible');
    })
});

casper.wait(2000);

// expand all options within the break down cart
casper.then(function() {
    casper.echo('Expand components within cost break down Cart');
    casper.evaluate(function() {
        $('.c-price .plus-minus-icon').click();
    });
});

casper.waitFor(function() {
    return casper.evaluate(function() {
        return $($('.fare-breakdown')[0]).hasClass('active') && $($('.fare-breakdown')[1]).hasClass('active');
    })
});

casper.wait(2000);

// take a picture of the expanded price break down
casper.then(function() {
    casper.evaluate(function() {
        // make values on page to standard pre difined values to minimize differences
        $('.date span').text('Mon Jan')
        $('.day').text('22');
    });
    camera.capture('#app-container', 'Air Select Page - Price Break Down Expanded View');
});


// check if select flight option is available
casper.waitFor(function() {
    return casper.evaluate(function() {
        return !$('#loading').is(':visible') && !$('#overlay').is(':visible') && $('#continue').is(':visible');
    })
});



// click the Select Flight/Continue button
casper.then(function() {
    casper.echo('Click on "Purchase Flight"');
    casper.evaluate(function() {
        $('#continue').click();
    });
});


// casper.then(function() {
//     casper.echo('Select the first INBOUND flight');
//     casper.evaluate(function() {
//         $($('.d-inbound .choose-flight')[0]).click();
//     });
// });

// casper.wait(10000);

// casper.then(function() {
//     camera.capture('#app-container', 'Air Select Page - Inbound Flight selected');

// });

// casper.then(function() {
//     casper.echo('Select the first class of service for INBOUND flight');
//     casper.evaluate(function() {
//         $($('.flc-initialized-flight .choose-flight')[0]).click();
//     });
// });

// casper.wait(10000);

// casper.then(function() {
//     camera.capture('#app-container', 'Air Select Page - Selected Inbound Class of Service');

// });




casper.waitFor(function() {
    return casper.evaluate(function() {
        return !$('#loading').is(':visible') && !$('#overlay').is(':visible') && document.title === 'Passengers Page';
    })
});

casper.then(function() {
    camera.capture('#app-container', 'Passengers Page - Home');
});

// expand the trip and price overlay option
casper.then(function() {
    casper.echo('Expand the trip and price overlay option');
    casper.evaluate(function() {
        $('.show-cart-details').click();
    });
});

casper.wait(4000);

// check if fare and taxes option is visible
casper.waitFor(function() {
    return casper.evaluate(function() {
        return $('.fare-breakdown').is(':visible');
    })
});

// expand all options within the break down cart
casper.then(function() {
    casper.echo('Expand components within cost break down Cart');
    casper.evaluate(function() {
        $('#cart-prices .plus-minus-icon').click();
    });
});

// make sure that the options have expanded
casper.waitFor(function() {
    return casper.evaluate(function() {
        return $($('.fare-breakdown')[0]).hasClass('active') && $($('.fare-breakdown')[1]).hasClass('active');
    })
});

casper.wait(2000);

casper.then(function() {
    camera.capture('#app-container', 'Expanded Passengers Page - Home');
});

// minimie the overlay
casper.then(function() {
    casper.echo('Minize the trip and price overlay option');
    casper.evaluate(function() {
        $('.show-cart-details').click();
    });
});

casper.wait(4000);

// check if fare and taxes option is hidden
casper.waitFor(function() {
    return casper.evaluate(function() {
        return !$('.fare-breakdown').is(':visible');
    })
});


// remove all animations from the page
casper.evaluate(function() {
    var style = document.createElement('style');
    style.innerHTML = '* { -webkit-animation-delay: 0.01s !important; -webkit-animation-duration: 0.01s !important; }';
    document.body.appendChild(style);
});


// Expand the passenger Add Details section
casper.then(function() {
    casper.echo('Expand the passenger Add Details section');
    casper.evaluate(function() {
        $('#psng-1 a').click();
    });
});



// check if all the data is loaded
// casper.waitFor(function() {
//     return casper.evaluate(function() {
//         return $('#passenger-1').find('.save-psng').is(':visible')
//     })
// });

casper.wait(10000);


casper.waitUntilVisible('#passenger-1',
    function() {
        //camera.capture('#app-container', 'Passengers Page - Add Details Section Extended');
    },
    function() {
        casper.echo('Add Passenger Details operation has expired');
    },
    10000
);


// fill out the passenger details
casper.then(function() {
    casper.echo("Fill out passenger information");
    camera.capture('#app-container', 'Log In Page - passenger details before filled out');
    casper.evaluate(function() {
        // set the title
        var title = $($('select')[0]);
        title.val($(title.find('option')[1]).attr('value'));

        // generate random name
        var text = "";
        var possible = "abcdefghijklmnopqrstuvwxyz";

        for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));


        // set firsnt name and last name
        $('#passenger-1 input[name="passengers[0].firstName"]').val(text);

        text = "";
        for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        $('#passenger-1 input[name="passengers[0].lastName"]').val(text);

        // set gender
        $('#passenger-1 input[value="MALE" ]').click()

        //setting the birth Date
        var now = new Date();
        var day = ("0" + now.getDate()).slice(-2);
        var month = ("0" + (now.getMonth() + 1)).slice(-2);
        var today = now.getFullYear() - 29 + "-" + (month) + "-" + (day);
        $('input[type="date"]').val(today);

        // special fields for Oman birthday
        if ($("select[name='passengers[0].info.dob.day']").length > 0) {
            $("select[name='passengers[0].info.dob.day']").val(1);
            $("select[name='passengers[0].info.dob.month']").val('01');
            $("select[name='passengers[0].info.dob.year']").val(now.getFullYear() - 29);
        }


        // st the phone number
        var phoneNumber = '817' + (Math.floor(Math.random() * 9000000) + 10000);
        if (document.URL.indexOf("EYM0") > -1) {
            $('#passenger-1 input[name="passengers[0].info.phone.number"]').val('817' + (Math.floor(Math.random() * 9000000) + 10000));
        }
        else if (document.URL.indexOf("PGM0") > -1 || document.URL.indexOf("VNM0") > -1) {
            $('#passenger-1 input[name="passengers[0].info.phone.countryCode"]').val('1');
            $('#passenger-1 input[name="passengers[0].info.phone.areaCode"]').val('817');
            $('#passenger-1 input[name="passengers[0].info.phone.number"]').val(phoneNumber.slice(3));
        }
        else {
            $('#passenger-1 input[name="passengers[0].info.phone.number"]').val('817' + (Math.floor(Math.random() * 9000000) + 10000));
        }


        // set email addresses
        text = "";
        for (var i = 0; i < 8; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        $('#passenger-1 input[name="passengers[0].info.email"]').val(text + '@gmail.com');
        $('#passenger-1 input[name="passengers[0].info.emailConfirm"]').val(text + '@gmail.com');

    });
});

casper.then(function() {
    camera.capture('#app-container', 'Passenger Page - passenger details filled out');
});

// Save user details
casper.then(function() {
    casper.echo("Save Passenger Information");
    casper.evaluate(function() {
        $('#passenger-1 button[type="submit"]').click();
    });
});

// wait for the save function to finish
casper.waitFor(function() {
    return casper.evaluate(function() {
        return !$('#passenger-1').find('.save-psng').is(':visible') && $('#psng-1 a.edit-details').is(':visible')
    })
});

//click the continue button and move to next screen
casper.then(function() {
    casper.echo("Proceed to Personalize Flight Section");
    casper.evaluate(function() {
        $('#continue').click();
    });
});

// wait for the next page to load
casper.waitFor(function() {
    return casper.evaluate(function() {
        return !$('#loading').is(':visible') && !$('#overlay').is(':visible') && $('#seats_1 ul li').first().find('header').size() > 0;
    });
});

casper.wait(8000);


casper.waitFor(function() {
    return casper.evaluate(function() {
        var images = document.getElementsByTagName('img');
        return Array.prototype.every.call(images, function(i) {
            return i.complete;
        });
    });
}, function then() {
    camera.capture('#app-container', 'Personalize Flight - Landing Page');
});

// Click On seats option
casper.then(function() {
    casper.echo("Select Seats for the flight");
    casper.evaluate(function() {
        var style = document.createElement('style');
        style.innerHTML = '* { -webkit-animation-delay: 0.01s !important; -webkit-animation-duration: 0.01s !important; }';
        document.body.appendChild(style);
        $('#seats_1 ul li').first().find('header').click();
    });
});

// wait for the Seat Selection page laods
casper.waitFor(function() {
    return casper.evaluate(function() {
        return !$('#loading').is(':visible') && !$('#overlay').is(':visible') && $('#seatmap-container').is(':visible');
    })
});

casper.wait('4000');

// Take a screen shot of the landing page
casper.then(function() {
    camera.capture('#app-container', 'Seat Selection - Landing Page');
});


casper.wait(2000);

// expand the flight
// casper.then(function() {
//     casper.echo("Expand the first flight seating avaiablilty");
//     casper.evaluate(function() {
//         $('#seatmap-container .seats>ul>li').first().find('.plus-minus-icon').click();
//     });
// });

casper.wait(2000);

// make sure the seat loading page opens up
casper.waitFor(function() {
    return casper.evaluate(function() {
        return !$('#loading').is(':visible') && !$('#overlay').is(':visible') && $('.seat-map-legend').is(':visible') || $('.unavailable').length > 0;
    })
});

casper.wait(2000);

// Take a screen shot of the error screen
casper.then(function() {
    camera.capture('#app-container', 'Seat Selection - First Flight avaiable seats');
});

// proceed to make a selection
// select an available seat
casper.then(function() {
    casper.echo("Pick a seat that is avaible");
    casper.evaluate(function() {
        if ($('.unavailable').length === 0) {
            var rows = $('#seatmap-container .seats>ul>li').first().find('.seat-map table>tbody>tr');
            rowLoop: for (var i = 0; i < rows.length; i++) {
                var cells = $(rows[i]).find('td');
                cellLoop: for (var j = 0; j < cells.length; j++) {
                    if ($(cells[j]).hasClass('status-seat')) {
                        $(cells[j]).click();
                        break rowLoop;
                    }
                }
            }
        }
    });
});

casper.wait(2000);

// make sure the Overlay opens up with the seat info
casper.waitFor(function() {
    return casper.evaluate(function() {
        return !$('#loading').is(':visible') && !$('#overlay').is(':visible') && $('#seat-popup').is(':visible') || $('.unavailable').length > 0;
    })
});

// Take a screen shot of the error screen
casper.then(function() {
    camera.capture('#app-container', 'Seat Selection - First Flight Seat Pick');
});

// click select seat
casper.then(function() {
    casper.echo("Select the picked seat");
    casper.evaluate(function() {
        if ($('.unavailable').length === 0) {
            $('#seat-popup #popup-select').click();
        }
    });
});

// make sure the Overlay opens up with the seat info
casper.waitFor(function() {
    return casper.evaluate(function() {
        if ($('#seatmap-container .seats>ul>li').length > 1) {
            return !$('#loading').is(':visible') && !$('#overlay').is(':visible') && $('#popup-next-flight').is(':visible') || $('.unavailable').length > 0;
        }
        else {
            return !$('#loading').is(':visible') && !$('#overlay').is(':visible') && !$('#seat-popup').is(':visible') || $('.unavailable').length > 0;
        }

    })
});

casper.wait(3000);

// Take a screen shot of the error screen
casper.then(function() {
    camera.capture('#app-container', 'Seat Selection - Next Step');
});

// click on save seat button
casper.then(function() {
    casper.echo("Click Save Seat");
    casper.evaluate(function() {
        $('#continue').click();
    });
});

// wait until the previous page re appears
casper.waitFor(function() {
    return casper.evaluate(function() {
        return !$('#loading').is(':visible') && !$('#overlay').is(':visible') && !$('#seatmap-container').is(':visible');
    })
});


casper.wait(3000);


// Take a screen shot of the error screen
casper.then(function() {
    camera.capture('#app-container', 'Personalize Your Flight - Seats Saved');
});


// proceed to click continue ont personalize flight screen to move to the next page
casper.then(function() {
    casper.echo("Click Continue on Personalize Flight Screen to move to the next xcreen");
    casper.evaluate(function() {
        $('#sbmt_1 button').click();
    });
});

// wait until the  page appears
casper.waitFor(function() {
    return casper.evaluate(function() {
        return !$('#loading').is(':visible') && !$('#overlay').is(':visible') && (document.title === 'Purchase Page' || document.title === 'Payment Page');
    })
});

casper.wait(3000);

// take a screen grab of the purchase page
casper.then(function() {
    camera.capture('#app-container', 'Purchase Page - Landing Page');
});

// remove all animations from the page
casper.evaluate(function() {
    var style = document.createElement('style');
    style.innerHTML = '* { -webkit-animation-delay: 0.01s !important; -webkit-animation-duration: 0.01s !important; }';
    document.body.appendChild(style);
});

// exoand the fare rules section
// casper.then(function() {
//     casper.echo("Expand the fare rules section");
//     camera.capture('#app-container', '1');
//     casper.evaluate(function() {
//         $('#fare-rules a').click();
//     });
//     camera.capture('#app-container', '2');
// });


// // wait for the fare rules to show up
// casper.waitFor(function() {
//     camera.capture('#app-container', '3');
//     return casper.evaluate(function() {
//         return $('.fare-rule').is(':visible');
//     })
// });

casper.wait(2000);

// snap a pic
casper.then(function() {
    camera.capture('#app-container', 'Purchase Page - Fare Rules');
});

// seletct a payment option
casper.then(function() {
    casper.echo("Select VISA for payment");
    casper.evaluate(function() {
        $('ul#credit-cards>li').find('#credit-card-BA').click();
    });
});

//wait for details section to show up
casper.waitFor(function() {
    return casper.evaluate(function() {
        return !$('#payment-details').is(':empty')
    })
});

// snap a pic
casper.then(function() {
    camera.capture('#app-container', 'Purchase Page - Payment Detiails');
});


casper.then(function() {
    casper.echo("Purchase without entering Card Details");
    casper.evaluate(function() {
        if (document.URL.indexOf("WYM0") > -1 || document.URL.indexOf("VNM0") > -1) {
            $('#agree-chechbox').prop('checked', true);
            $('#continue').prop('disabled', false)
            setTimeout(function() {
                $('#continue').click();
            }, 2000);
        }
        else {
            $('#continue').click();
        }

    });
});

// wait for overlay
casper.waitFor(function() {
    return casper.evaluate(function() {
        return $('#modal').is(':visible');
    });
});

casper.then(function() {
    casper.echo("Close error Overlay");
    casper.evaluate(function() {
        $('#modal button').click();
    });
});

// wait for overlay to disappear
casper.waitFor(function() {
    return casper.evaluate(function() {
        return !$('#modal').is(':visible')
    })
});

casper.wait(4000);

casper.then(function() {
    camera.capture('#app-container', 'Purchase Page - Missing Payment Details');
});



// fil in the payment details
casper.then(function() {
    casper.echo("Fill Payment information");
    casper.evaluate(function() {
        $('input[name="selectedCards[0].cardNumber"]').val('4111111111111111');
        $('input[name="selectedCards[0].nameOnCard"]').val('John Doe');
        $('select[name="selectedCards[0].expDate.month"]').val('01');
        $('select[name="selectedCards[0].expDate.year"]').val(new Date().getFullYear() + 1);
        $('input[name="selectedCards[0].cvcNumber"]').val('123');
        $('input[name="selectedCards[0].billingData.street1"]').val('904 Greek Row Dr');
        $('input[name="selectedCards[0].billingData.street2"]').val('Apt 222');
        $('input[name="selectedCards[0].billingData.city"]').val('Arlington');
        $('input[name="selectedCards[0].billingData.zipCode"]').val('76013');
        $('select[name="selectedCards[0].billingData.country"]').val('US');
    });
});

casper.then(function() {
    camera.capture('#app-container', 'Purchase Page - Payment Details Filled out');
});

// // click on purchase button to complete the payment 
// casper.then(function() {
//     casper.echo("click on purchase button to complete the payment ");
//     casper.evaluate(function() {
//         $('#continue').click();
//     });
// });

// // wait for the confirmation page to load
// casper.waitFor(function() {
//     return casper.evaluate(function() {
//             // if this is Oman airlines then the passsword verification page appears before confirmation page
//             if(document.URL.indexOf("WYM0") > -1){
//                 return document.title === "Default";
//             }else{
//                 return !$('#loading').is(':visible') && (!$('#overlay').is(':visible') || $('#overlay').is(':visible'))  && (document.title === 'Confirmation Page' || document.title === 'Purchase Page');    
//             }

//     })
// });

// casper.wait(5000);


// casper.then(function() {
//     casper.echo("If Oman, then entere 3DS password for Visa ");
//     var result = casper.evaluate(function() {
//         if(document.URL.indexOf("WYM0") > -1){
//             document.getElementById('PasswordTextBox').value = "0001"
//             document.getElementById('SubmitButton').click();
//             return 0;
//         }
//         if(!$('#loading').is(':visible') && $('#overlay').is(':visible')  && document.title === 'Confirmation Page'){
//             return 1;
//         }
//         if(!$('#loading').is(':visible') && $('#overlay').is(':visible')  && document.title === 'Purchase Page'){
//             return 2;
//         }
//         return 0;
//     });

//     if(result === 1){
//         // this means some error message has  popped up on the confirmation page 
//         casper.echo("An error on the confirmation page!!");
//         camera.capture('#app-container', 'Error Confirmation Page');
//         casper.die("Exiting Casper js now....");
//     }
//     if(result === 2){
//         // this means some error message has  popped up on the Purchase page 
//         casper.echo("An error on the Purchase page!!");
//         camera.capture('#app-container', 'Error Purchase Page');
//         casper.die("Exiting Casper js now....");
//     }
// });

// casper.waitFor(function() {
//     return casper.evaluate(function() {
//         if(document.URL.indexOf("WYM0") > -1){
//             return null !== document.getElementById('ResultTable');
//         }else{
//             return true;
//         }
//     });
// });

// casper.then(function() {
//     casper.echo("If Oman, then head back to application confirmation page ");
//     casper.evaluate(function() {
//         if(document.URL.indexOf("WYM0") > -1){
//             document.getElementById('ContinueButton').click();
//         }
//     });
// });


// casper.waitFor(function() {
//     return casper.evaluate(function() {
//         return !$('#loading').is(':visible') && !$('#overlay').is(':visible') && document.title === 'Confirmation Page';    
//     })
// });


// casper.then(function() {
//     camera.capture('#app-container', 'Confirmation Page');
// });

casper.run(function() {
    casper.echo("CASPER COMPLETED.");
    casper.exit();
});