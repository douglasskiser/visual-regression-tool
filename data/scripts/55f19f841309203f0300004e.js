var casper = require('casper').create({
	logLevel: 'debug',
	waitTimeout: 50000,
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
 *	Test Begin
 */

casper.waitFor(function() {
	return casper.evaluate(function() {
		return !$('#loading').is(':visible') && !$('#overlay').is(':visible') && $('#departure-airport>option').size() > 0;
	});
});

casper.evaluate(function() {
	var style = document.createElement('style');
	style.innerHTML = '* { -webkit-animation-delay: 0.01s !important; -webkit-animation-duration: 0.01s !important; }';
	$('head').append(style);
});

casper.wait(5000);

casper.then(function() {
	casper.echo("Make it a one way flight");
	casper.evaluate(function(a) {
		// set the static values
		window.departureAirport = "DFW";
		window.arrivalAirport = "DEL";
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
	casper.echo("Set the arrival airport to be the first item in the list");
	casper.evaluate(function() {
		var arrivalAirport = $('#arrival-airport');
		arrivalAirport.val(window.arrivalAirport);
	});
});

casper.then(function() {
	camera.capture('#app-container', 'Air Search Page - Arrival Airport selected');
});
casper.wait(4000);

// set a date before today
casper.then(function() {
	casper.echo("Set departure date to a past date");
	casper.evaluate(function() {
		//setting the dates
		var $today = new Date();
		var $yesterday = new Date($today);
		$yesterday.setDate($today.getDate() - 1);
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
	camera.capture('#app-container', 'Air Search Page - Noflights Found Screen shot');
});

// close the over lay
casper.then(function() {
	casper.echo("Close the invalid date error message overlay");
	casper.evaluate(function() {
		$('#modal .modal-close').click();
	});
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
		var $today = new Date();
		var $futureDate = new Date($today);
		$futureDate.setDate($today.getDate() + 30);
		$('#departure-date').val($futureDate.getFullYear() + '/' + ($futureDate.getMonth() + 1) + "/" + $futureDate.getDate());
		$('#continue').click();
	});
});

casper.waitFor(function() {
	return casper.evaluate(function() {
		return !$('#loading').is(':visible') && !$('#overlay').is(':visible') && document.title === 'Air Select Page';
	})
});

casper.then(function() {
	casper.echo('Select the first OUTBOUND flight');
	camera.capture('#app-container', 'Air Select Page - Outbound flight List');
	casper.evaluate(function() {
		$('.direction-box.d-outbound ul.flights li').first().find('.choose-flight').click();
	});
});

casper.waitFor(function() {
	return casper.evaluate(function() {
		return !$('#loading').is(':visible') && !$('#overlay').is(':visible') && $('.page').offset().top === 0;
	})
});

casper.wait(15000);

// casper.then(function() {
//     camera.capture('#app-container', 'Air Select Page - Outbound flight selected');
// });

// select flight service class
casper.then(function() {
	camera.capture('#app-container', 'Air Select Page - Outbound flight selected');
	casper.echo('Select the first class of service for OUTBOUND flight');
	casper.evaluate(function() {
		$($('.basket .select-flight')[0]).click();
	});
});

casper.wait(10000);

casper.then(function() {
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
	});
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
	});
});

// Expand the passenger Add Details section
casper.then(function() {
	casper.echo('Expand the passenger Add Details section');
	casper.evaluate(function() {
		$('#psng-1 a').click();
	});
});

// check if all the data is loaded
casper.waitFor(function() {
    return casper.evaluate(function() {
        return $('#passenger-1').find('.save-psng').is(':visible');
    });
});

casper.wait(10000);

// casper.waitUntilVisible('#passenger-1',
// 	function() {
// 		//camera.capture('#app-container', 'Passengers Page - Add Details Section Extended');
// 	},
// 	function() {
// 		casper.echo('Add Passenger Details operation has expired');
// 	},
// 	10000
// );

// // fill out the passenger details
// casper.then(function() {
// 	casper.echo("Fill out passenger information");
// 	camera.capture('#app-container', 'Log In Page - passenger details before filled out');
// 	casper.evaluate(function() {
// 		// set the title
		// var title = $($('select')[0]);
		// title.val($(title.find('option')[1]).attr('value'));

		// // generate random name
		// var text = "";
		// var possible = "abcdefghijklmnopqrstuvwxyz";

		// for (var i = 0; i < 5; i++)
		// 	text += possible.charAt(Math.floor(Math.random() * possible.length));

		// // set firsnt name and last name
		// $('#passenger-1 input[name="passengers[0].firstName"]').val(text);

		// text = "";
		// for (var i = 0; i < 5; i++)
		// 	text += possible.charAt(Math.floor(Math.random() * possible.length));
		// $('#passenger-1 input[name="passengers[0].lastName"]').val(text);

		// // set gender
		// $('#passenger-1 input[value="MALE" ]').click()

		// //setting the birth Date
		// var now = new Date();
		// var day = ("0" + now.getDate()).slice(-2);
		// var month = ("0" + (now.getMonth() + 1)).slice(-2);
		// var today = now.getFullYear() - 30 + "-" + (month) + "-" + (day);
		// $('input[type="date"]').val(today);

		// // st the phone number
		// $('#passenger-1 input[name="passengers[0].info.phone.number"]').val('817' + (Math.floor(Math.random() * 9000000) + 10000));

		// // set email addresses
		// text = "";
		// for (var i = 0; i < 8; i++)
		// 	text += possible.charAt(Math.floor(Math.random() * possible.length));

		// $('#passenger-1 input[name="passengers[0].info.email"]').val(text + '@gmail.com');
		// $('#passenger-1 input[name="passengers[0].info.emailConfirm"]').val(text + '@gmail.com');
// 	});
// });

// casper.then(function() {
// 	camera.capture('#app-container', 'Log In Page - passenger details filled out');
// });

// // Save user details
// casper.then(function() {
// 	casper.echo("Save Passenger Information");
// 	casper.evaluate(function() {
// 		$('#passenger-1 button[type="submit"]').click();
// 	});
// });

// // wait for the save function to finish
// casper.waitFor(function() {
// 	return casper.evaluate(function() {
// 		return !$('#passenger-1').find('.save-psng').is(':visible') && $('#psng-1 a.edit-details').is(':visible')
// 	})
// });

// casper.wait(5000);

// casper.then(function() {
// 	camera.capture('#app-container', 'Log In Page - passenger details saved');
// });

// // click login button without username or password
// casper.then(function() {
// 	casper.echo("Click Login button without information");
// 	casper.evaluate(function() {
// 		$('#login_1 button[type="submit"]').click();
// 	});
// });

// // wait until the required field validation error occurs
// casper.waitFor(function() {
// 	return casper.evaluate(function() {
// 		return $('#login_1 .validation-error').length > 0;
// 	})
// });

// casper.wait(2000);

// casper.then(function() {
// 	camera.capture('#app-container', 'Log In Page - Empty Login Information provided');
// });

// // fill in incorrect user name and password
// // casper.then(function() {
// //     casper.echo("Enter Incorrect passenger login information");
// //     casper.evaluate(function() {
// //         $('input[name="username"]').not('#login-form input[name="username"]').val('InvalidCredentials');
// //         $('input[name="password"]').not('#login-form input[name="password"]').val('Invalid');
// //         $('#login_1 button[type="submit"]').click();
// //     });
// // });

// // wait until the error overlay appears with incorrect login cred details
// // casper.waitFor(function() {
// //     return casper.evaluate(function() {
// //         return !$('#loading').is(':visible') && $('#overlay').is(':visible');
// //     })
// // });

// // casper.wait(2000);

// // casper.then(function() {
// //     camera.capture('#app-container', 'Log In Page - Incorrect Login Information provided');
// // });

// // // close the over lay
// // casper.then(function() {
// //     casper.echo("Close incorrect login information provided overlay");
// //     casper.evaluate(function() {
// //         $('#modal button').click();
// //     });
// // });

// // // wait until the error overlay disappears with incorrect login cred details
// // casper.waitFor(function() {
// //     return casper.evaluate(function() {
// //         return !$('#loading').is(':visible') && !$('#overlay').is(':visible');
// //     })
// // });

// // casper.wait(2000);

// // // fill in user name and password
// // casper.then(function() {
// //     casper.echo("Enter passenger login information");
// //     casper.evaluate(function() {
// //         $('input[name="username"]').not('#login-form input[name="username"]').val('100104793084');
// //         $('input[name="password"]').not('#login-form input[name="password"]').val('awPTCesx');
// //         $('#login_1 button[type="submit"]').click();
// //         $('#login_1 button[type="submit"]').click();
// //         $('#login_1 button[type="submit"]').submit();
// //     });
// // });

// // // wait for the login process to compelte
// // casper.waitFor(function() {
// //     return casper.evaluate(function() {
// //         return !$('#loading').is(':visible') && !$('#overlay').is(':visible') && $('#sign-in span:nth-child(-n + 2)').text() === "My Etihad Guest,Sumera";
// //     })
// // });

// // casper.wait('4000');

// // // capture image
// // casper.then(function() {
// //     camera.capture('#app-container', 'Log In Page - Passenger Logged In');
// // });

// // click the continue button and move to next screen
// // casper.then(function() {
// //     casper.echo("Proceed to Personalize Flight Section");
// //     casper.evaluate(function() {
// //         $('#continue').click();
// //     });
// // });

// // // this user has incorrect phone number details, so this needs to be captured and handled
// // casper.waitFor(function() {
// //     return casper.evaluate(function() {
// //     	var errorText = "There was an error with your submission, please review your entries.";
// //         return !$('#loading').is(':visible') && $('#overlay').is(':visible') && $('#modal p').text() === errorText;
// //     })
// // });

// // // Take a screen shot of the error screen
// // casper.then(function() {
// //     camera.capture('#app-container', 'Log In Page - Submission Error');
// // });

// // // click on the close button on the overlay
// // casper.then(function() {
// //     casper.echo("Close the error submission overlay");
// //     casper.evaluate(function() {
// //         $('#modal button').click();
// //     });
// // });

// // casper.waitFor(function() {
// //     return casper.evaluate(function() {
// //         return !$('#loading').is(':visible') && !$('#overlay').is(':visible');
// //     })
// // });

// // casper.wait('2000');

// // // click on edit details and correct the passenger phone number info
// // casper.then(function() {
// //     casper.echo("Edit passenger information");
// //     casper.evaluate(function() {
// //         $('#psng-1 .edit-details').click();
// //     });
// // });

// // casper.wait(8000);


// // casper.waitUntilVisible('#passenger-1',
// //     function() {
// //         //camera.capture('#app-container', 'Passengers Page - Add Details Section Extended');
// //     },
// //     function(){
// //         casper.echo('Edit Passenger Details operation has expired');
// //     },
// //     10000
// // );

// // casper.wait(2000);


// // // fill out the phone number details
// // casper.then(function() {
// //     casper.echo("Correct Passnger Phone Number");
// //     camera.capture('#app-container', 'Log In Page - Phone Number too short error');
// //     casper.evaluate(function() {
// //         // st the phone number
// //         $('#passenger-1 input[name="passengers[0].info.phone.number"]').val(8179869123);
// //         $('#passenger-1 input[name="passengers[0].info.email"]').val('john.doe@gmail.com')
// //         //setting the birth Date
// //         var now = new Date();
// //         var day = ("0" + now.getDate()).slice(-2);
// //         var month = ("0" + (now.getMonth() + 1)).slice(-2);
// //         var today = now.getFullYear() - 30 +"-"+(month)+"-"+(day) ;
// //         $('input[type="date"]').val(today);
// //     });
// // });

// // // Save user details
// // casper.then(function() {
// //     casper.echo("Save Passenger Information");
// //     casper.evaluate(function() {
// //         $('#passenger-1 button[type="submit"]').click();
// //     });
// // });

// // // wait for the save function to finish
// // casper.waitFor(function() {
// //     return casper.evaluate(function() {
// //         return !$('#passenger-1').find('.save-psng').is(':visible') && $('#psng-1 a.edit-details').is(':visible')
// //     })
// // });

// // casper.wait(5000);

// // Re-click the continue button and move to next screen
// casper.then(function() {
// 	casper.echo("Proceed to Personalize Flight Section Second Time");
// 	casper.evaluate(function() {
// 		$('#continue').click();
// 	});
// });

// // wait for the next page to laod
// casper.waitFor(function() {
// 	return casper.evaluate(function() {
// 		return !$('#loading').is(':visible') && !$('#overlay').is(':visible') && $('#ancillary_1').length === 1;
// 	})
// });

// casper.wait('8000');

// casper.waitFor(function() {
// 	return casper.evaluate(function() {
// 		var images = document.getElementsByTagName('img');
// 		return Array.prototype.every.call(images, function(i) {
// 			return i.complete;
// 		});
// 	});
// }, function then() {
// 	camera.capture('#app-container', 'Personalize Flight - Landing Page');
// });

// // Click On seats option
// casper.then(function() {
// 	casper.echo("Select Seats for the flight");
// 	casper.evaluate(function() {
// 		var style = document.createElement('style');
// 		style.innerHTML = '* { -webkit-animation-delay: 0.01s !important; -webkit-animation-duration: 0.01s !important; }';
// 		document.body.appendChild(style);
// 		$('#seats_1 ul li').first().find('header').click();
// 	});
// });

// // wait for the Seat Selection page laods
// casper.waitFor(function() {
// 	return casper.evaluate(function() {
// 		return !$('#loading').is(':visible') && !$('#overlay').is(':visible') && $('#seatmap-container').is(':visible');
// 	})
// });

// casper.wait('4000');

// // Take a screen shot of the landing page
// casper.then(function() {
// 	camera.capture('#app-container', 'Seat Selection - Landing Page');
// });

// casper.wait(2000);

// // expand the flight
// // casper.then(function() {
// //     casper.echo("Expand the first flight seating avaiablilty");
// //     casper.evaluate(function() {
// //         $('#seatmap-container .seats>ul>li').first().find('.plus-minus-icon').click();
// //     });
// // });

// casper.wait(2000);

// // make sure the seat loading page opens up
// casper.waitFor(function() {
// 	return casper.evaluate(function() {
// 		return !$('#loading').is(':visible') && !$('#overlay').is(':visible') && $('.seat-map-legend').is(':visible');
// 	})
// });

// casper.wait(2000);

// // Take a screen shot of the error screen
// casper.then(function() {
// 	camera.capture('#app-container', 'Seat Selection - First Flight avaiable seats');
// });

// // proceed to make a selection
// // select an available seat
// casper.then(function() {
// 	casper.echo("Pick a seat that is avaible");
// 	casper.evaluate(function() {
// 		var rows = $('#seatmap-container .seats>ul>li').first().find('.seat-map table>tbody>tr');
// 		rowLoop: for (i = 0; i < rows.length; i++) {
// 			var cells = $(rows[i]).find('td');
// 			cellLoop: for (j = 0; j < cells.length; j++) {
// 				if ($(cells[j]).hasClass('status-seat')) {
// 					$(cells[j]).click();
// 					break rowLoop;
// 				}
// 			}
// 		}
// 	});
// });

// casper.wait(2000);

// // make sure the Overlay opens up with the seat info
// casper.waitFor(function() {
// 	return casper.evaluate(function() {
// 		return !$('#loading').is(':visible') && !$('#overlay').is(':visible') && $('#seat-popup').is(':visible');
// 	})
// });

// // Take a screen shot of the error screen
// casper.then(function() {
// 	camera.capture('#app-container', 'Seat Selection - First Flight Seat Pick');
// });

// // click select seat
// casper.then(function() {
// 	casper.echo("Select the picked seat");
// 	casper.evaluate(function() {
// 		$('#seat-popup #popup-select').click();
// 	});
// });

// // make sure the Overlay opens up with the seat info
// casper.waitFor(function() {
// 	return casper.evaluate(function() {
// 		if ($('#seatmap-container .seats>ul>li').length > 1) {
// 			return !$('#loading').is(':visible') && !$('#overlay').is(':visible') && $('#popup-next-flight').is(':visible');
// 		}
// 		else {
// 			return !$('#loading').is(':visible') && !$('#overlay').is(':visible') && !$('#seat-popup').is(':visible');
// 		}

// 	})
// });

// casper.wait(3000);

// // Take a screen shot of the error screen
// casper.then(function() {
// 	camera.capture('#app-container', 'Seat Selection - Next Step');
// });

// // click on save seat button
// casper.then(function() {
// 	casper.echo("Click Save Seat");
// 	casper.evaluate(function() {
// 		$('#continue').click();
// 	});
// });

// // wait until the previous page re appears
// casper.waitFor(function() {
// 	return casper.evaluate(function() {
// 		return !$('#loading').is(':visible') && !$('#overlay').is(':visible') && !$('#seatmap-container').is(':visible');
// 	})
// });

// casper.wait(3000);

// // Take a screen shot of the error screen
// casper.then(function() {
// 	camera.capture('#app-container', 'Personalize Your Flight - Seats Saved');
// });

// // proceed to click continue ont personalize flight screen to move to the next page
// casper.then(function() {
// 	casper.echo("Click Continue on Personalize Flight Screen to move to the next screen");
// 	casper.evaluate(function() {
// 		$('#sbmt_1 button').click();
// 	});
// });

// // wait until the  page appears
// casper.waitFor(function() {
// 	return casper.evaluate(function() {
// 		return !$('#loading').is(':visible') && !$('#overlay').is(':visible') && document.title === 'Purchase Page';
// 	})
// });

// casper.wait(3000);

// // take a screen grab of the purchase page
// casper.then(function() {
// 	camera.capture('#app-container', 'Purchase Page - Landing Page');
// });

// // remove all animations from the page
// casper.evaluate(function() {
// 	var style = document.createElement('style');
// 	style.innerHTML = '* { -webkit-animation-delay: 0.01s !important; -webkit-animation-duration: 0.01s !important; }';
// 	document.body.appendChild(style);
// });

// // exoand the fare rules section
// casper.then(function() {
// 	casper.echo("Expand the fare rules section");
// 	casper.evaluate(function() {
// 		$('#fare-rules a').click();
// 	});
// });

// // wait for the fare rules to show up
// casper.waitFor(function() {
// 	return casper.evaluate(function() {
// 		return $('.fare-rule').is(':visible');
// 	})
// });

// casper.wait('2000');

// // snap a pic
// casper.then(function() {
// 	camera.capture('#app-container', 'Purchase Page - Fare Rules');
// });

// // seletct a payment option
// casper.then(function() {
// 	casper.echo("Select VISA for payment");
// 	casper.evaluate(function() {
// 		$('ul#credit-cards>li').find('#credit-card-BA').click();
// 	});
// });

// //wait for details section to show up
// casper.waitFor(function() {
// 	return casper.evaluate(function() {
// 		return !$('#payment-details').is(':empty');
// 	})
// });

// // snap a pic
// casper.then(function() {
// 	camera.capture('#app-container', 'Purchase Page - Payment Detiails');
// });

// casper.then(function() {
// 	casper.echo("Purchase without entering Card Details");
// 	casper.evaluate(function() {
// 		$('#continue').click();
// 	});
// });

// // wait for overlay
// casper.waitFor(function() {
// 	return casper.evaluate(function() {
// 		return $('#modal').is(':visible')
// 	})
// }, function then() {}, function timeout() { casper.echo("Waiting for overlay timed out!"); }, 50000);

// casper.then(function() {
// 	casper.echo("Close error Overlay");
// 	casper.evaluate(function() {
// 		$('#modal button').click();
// 	});
// });

// // wait for overlay to disappear
// casper.waitFor(function() {
// 	return casper.evaluate(function() {
// 		return !$('#modal').is(':visible')
// 	})
// });

// casper.wait(4000);

// casper.then(function() {
// 	camera.capture('#app-container', 'Purchase Page - Missing Payment Details');
// });

// // fil in the payment details
// casper.then(function() {
// 	casper.echo("Fill Payment information");
// 	casper.evaluate(function() {
// 		$('input[name="selectedCards[0].cardNumber"]').val('4111111111111111');
// 		$('input[name="selectedCards[0].nameOnCard"]').val('John Doe');
// 		$('select[name="selectedCards[0].expDate.month"]').val('01');
// 		$('select[name="selectedCards[0].expDate.year"]').val(new Date().getFullYear() + 1);
// 		$('input[name="selectedCards[0].cvcNumber"]').val('123');
// 		$('input[name="selectedCards[0].billingData.street1"]').val('904 Greek Row Dr');
// 		$('input[name="selectedCards[0].billingData.street2"]').val('Apt 222');
// 		$('input[name="selectedCards[0].billingData.city"]').val('Arlington');
// 		$('input[name="selectedCards[0].billingData.zipCode"]').val('76013');
// 		$('select[name="selectedCards[0].billingData.country"]').val('US');
// 	});
// });

// casper.then(function() {
// 	camera.capture('#app-container', 'Purchase Page - Payment Details Filled out');
// });

// // click on purchase button to complete the payment
// casper.then(function() {
// 	casper.echo("click on purchase button to complete the payment ");
// 	casper.evaluate(function() {
// 		$('#continue').click();
// 	});
// });

// // wait for the confirmation page to load
// casper.waitFor(function() {
// 	return casper.evaluate(function() {
// 		return !$('#loading').is(':visible') && !$('#overlay').is(':visible') && document.title === 'Confirmation Page';
// 	})
// });

// casper.wait(5000);

// casper.then(function() {
// 	camera.capture('#app-container', 'Confirmation Page Landing page');
// });

casper.run(function() {
	casper.echo("CASPER COMPLETED.");
	casper.exit();
});