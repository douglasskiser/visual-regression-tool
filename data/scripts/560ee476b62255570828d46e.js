/* global casper */
casper.test.begin('Book My Flight', function suite(test) {
	casper.start("https://wlstan-cert.sabre.com/SSW2010/EYM0/#webqtrip");

	casper.then(function() {
		casper.evaluate(function() {
			window.departureAirport = 'AUH';
			window.arrivalAirport = 'BAH';
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
			//window.province = 'TX';
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
		casper.evaluate(function() {
			var tomorrowDate = new Date();
			tomorrowDate.setDate(tomorrowDate.getDate()+1);
			var date = tomorrowDate.getFullYear() + "/" + (tomorrowDate.getMonth() + 1) + "/" + tomorrowDate.getDate();
			$('#departure-date').val(date);
			var tomorrowDate1 = new Date();
			tomorrowDate1.setDate(tomorrowDate1.getDate()+4);
			var date1 = tomorrowDate1.getFullYear() + "/" + (tomorrowDate1.getMonth() + 1) + "/" + tomorrowDate1.getDate();
			$('#return-date').val(date1);
			window.departureDate = date;
			window.returnDate = date1;
		});
	});

	casper.then(function(){
		test.assertEval(function() {
			return $('[data-translate="label.fsc.bookAFlight"]').text().length > 0;
		}, 'Page slogan is verified');

		test.assertEval(function() {
			return $('#departure-airport').find('option').length > 0;
		}, 'Departure airports are correctly loaded.');

		test.assertEval(function() {
			return $('#departure-date').size() > 0 && $('#return-date').size() > 0;
		}, 'departure date and return date are present');

		test.assertEval(function(){
			return $('[data-translate="Cabin.ECONOMY"]').text().length > 0 && $('[data-translate="Cabin.BUSINESS"]').text().length > 0;
		}, 'Economy  and business  class is verified');

		test.assertEval(function() {
			return $("#ADT_passengers").val() === "1" &&
				$("#CHD_passengers").val() === "0" &&
				($('#INF_passengers').length ? ($('#INF_passengers').val() === "0") : true);
		}, 'ADT is set to 1, CHD is set to 0 and INF is set to 0');
	});

	casper.then(function() {
		casper.evaluate(function() {
			$('#departure-airport').val(window.departureAirport);
			$('#departure-airport').change();
		});
		test.assertEval(function() {
			return ($("#departure-airport").val() === window.departureAirport);
		}, 'departure airport is set to AUH');
	});

	casper.waitFor(function() {
		return casper.evaluate(function() {
			return window.isLoadingHidden() && $('#arrival-airport>option').size() > 0;
		});
	}, function then() {}, function timeout() {}, 30000);

	casper.then(function() {
		test.assertEval(function() {
			return $('#arrival-airport>option').size() > 0;
		}, 'Arrival Airports populated');

		test.assertEval(function() {
			return ($('#promo-code').length ? ($('#promo-code').size() > 0) : true);
		}, 'promo code is present');

		test.assertEval(function() {
			return $('#flight-type-return-trip').val() === 'ROUND_TRIP' && $('#flight-type-return-trip').is(':checked') && $('#flight-type-one-way-trip').val() === 'ONE_WAY' && $('#flight-type-one-way-trip').is(':not(:checked)');
		}, 'Roundtrip/Oneway selector is present. ROUND_TRIP is marked as default.');
	});

	casper.then(function() {
		casper.evaluate(function() {
			$("#arrival-airport").val(window.arrivalAirport);
			$("#arrival-airport").change();
		});

		test.assertEval(function() {
			return ($("#arrival-airport").val() === window.arrivalAirport);
		}, 'arrival airport is set correctly');

		casper.evaluate(function() {
			$('#continue').trigger('click');
		});
	});

	casper.waitFor(function() {
		return casper.evaluate(function() {
			return window.isLoadingHidden() && window.isInPage('AIR_SEARCH_PAGE') && $('[data-translate="label.flc.noFlightsHeader"]').size() > 0;
		});
	}, function then() {}, function timeout() {}, 30000);

	casper.thenBypassIf(function() {
		return casper.evaluate(function() {
			return $('[data-translate="label.flc.noFlightsHeader"]').size() === 0;
		})
	}, 1);

	casper.wait(5000);

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
			}, 'No flights were found for the route AUH to BAH');

			casper.exit();
		}
	});

	casper.waitFor(function() {
		return casper.evaluate(function() {
			return window.isLoadingHidden() && window.isInPage('AIR_SELECT_PAGE') && $('.flight-info').size()>0;
		});
	}, function then() {}, function timeout() {}, 30000);

	casper.then(function() {
		test.assertEval(function() {
			return $('.flight-info').size()>0;
		}, 'flight list page loaded and departure/arrival airports are correct')

		test.assertEval(function() {
			var date =  $($('.flight-info .span6 .day strong')[0]);
			date = date.attr("data-translate");
			date = date.split(' ')[0];
			date = date.replace(/\/0(\d)/g, '/$1');
			return date == window.departureDate;
		}, 'departure date value is verified');

		test.assertEval(function() {
			var date1 =  $($('.flight-info .span6 .day strong')[1]);
			date1 = date1.attr("data-translate");
			date1 = date1.split(' ')[0];
			date1 = date1.replace(/\/0(\d)/g, '/$1');
			return date1 == window.returnDate;
		}, 'return date value is verified');

		casper.evaluate(function() {
			$($(".flc-initialized-outbound")[0]).find('.choose-flight').click();
		});
	});

	casper.then(function() {
		test.assertEval(function() {
			return (($($('[data-direction="outbound"]')[0]).find('.basket-element').size() > 0) || ($($(".flc-initialized-outbound")[0]).find('.basket-element').size() > 0));
		}, 'check if the basket has more than 0 items');

		casper.evaluate(function() {
			$($($(".flc-initialized-outbound")[0]).find('.basket-element').find('.select-flight')[0]).click();
		});

		casper.evaluate(function() {
			$($(".flc-initialized-inbound")[0]).find('.choose-flight').click();
		});

		test.assertEval(function() {
			return (($($('[data-direction="inbound"]')[0]).find('.basket-element').size() > 0) || ($($(".flc-initialized-inbound")[0]).find('.basket-element').size() > 0));
		}, 'check if the basket has more than 0 items');

		casper.evaluate(function() {
			$($($(".flc-initialized-inbound")[0]).find('.basket-element').find('.select-flight')[0]).click();
		});
	});

	casper.waitFor(function() {
		return casper.evaluate(function() {
			return window.isLoadingHidden() && $('.component.cart.price').is(':visible');
		});
	}, function then() {}, function timeout() {}, 30000);

	casper.then(function() {
		casper.evaluate(function() {
			window.totalAmount = $('#total-amount .amount').text().trim();
			$('#continue').click();
		});
	});

	casper.waitFor(function() {
		return casper.evaluate(function() {
			return window.isLoadingHidden() && window.isInPage('PASSENGERS_PAGE');
		});
	}, function then() {}, function timeout() {}, 30000);

	casper.then(function() {
		test.assertEval(function() {
			return window.totalAmount === $('.trip-price .amount').text().trim() && $($('.cart-info').find('.f-title')[0]).text() === window.departureAirport && $($('.cart-info').find('.f-title')[1]).text() === window.arrivalAirport;
		}, 'cart information is correct');

		test.assertEval(function() {
			return $('.loginForm [name="username"]:visible').size() > 0 && $('.loginForm [name="password"]:visible').size() > 0 && $('.loginForm .remember-me:visible').size() > 0;
		}, 'login form is correctly displayed');

		casper.evaluate(function() {
			$('.show-psng-form[data-psng-index="1"]').click();

			$('[name="passengers[0].prefix"]').val('MR');
			$('[name="passengers[0].firstName"]').val('John');
			$('[name="passengers[0].lastName"]').val('Doe');
			$('[name="passengers[0].info.phone.countryCode"]').val('66');
			$('[name="passengers[0].info.phone.areaCode"]').val('852');
			$('[name="passengers[0].info.phone.number"]').val('8179325799');
			$('[name="passengers[0].info.email"],.field-emailConfirm').val('email@email.com');
			$('[name="passengers[0].info.dob"]').val('1990-04-22');
			$('.save-psng').click();
		});
	});

	casper.waitFor(function() {
		return casper.evaluate(function() {
			return window.isLoadingHidden() &&  $("#continue").size() > 0
		});
	});

	casper.then(function() {
		casper.evaluate(function() {
			$("#continue").click();
		});
	});

	casper.waitFor(function() {
		return casper.evaluate(function() {
			return window.isLoadingHidden() && window.isInPage('ANCILLARY_PAGE');
		});
	}, function then() {}, function timeout() {}, 30000);

	casper.then(function() {
		casper.evaluate(function() {
			$('#ancillary-seats .btn').click();
		});
	});

	casper.waitFor(function() {
		return casper.evaluate(function() {
			return window.isLoadingHidden() && window.isInPage('ANCILLARY_PAGE');
		});
	}, function then() {}, function timeout() {}, 30000);

	// casper.then(function() {
	//		test.assertEval(function() {
	//         return $('[data-translate="label.seats.seatMapNotAvailable.sidebarMessage"]') ?  === 0 ? ;
	//     },'Seats unavailable for this selection.');

	//		casper.evaluate(function() {
	//         $('[data-translate="label.seats.nextFlight.title"]').click()
	//     });
	// });

	casper.waitFor(function() {
		return casper.evaluate(function() {
			return window.isLoadingHidden() && window.isInPage('ANCILLARY_PAGE');
		});
	}, function then() {}, function timeout() {}, 30000);

	// casper.then(function() {
	//     test.assertEval(function() {
	//         return $('.seat-map-legend').size() > 0;
	//     },'check for legend map');


	//     test.assertEval(function() {
	//         return $('li.active .seat.status-seat').size() > 0;
	//     },'There must be available seats');

	//     casper.evaluate(function() {
	//        $('li.active .seat.status-seat')[1].click();
	//        $('#popup-select').click();
	//      });
	// });

	casper.waitFor(function() {
		return casper.evaluate(function() {
			return window.isLoadingHidden() && window.isInPage('ANCILLARY_PAGE');
		});
	}, function then() {}, function timeout() {}, 30000);

	casper.then(function() {
		// test.assertEval(function() {
		//     return $('.ancillary-seats.slideLeft .psng-list').size() >= 1;
		// },'check for passengers list to be 1');

		casper.evaluate(function() {
			$('#continue').click();
		});
	});

	casper.waitFor(function() {
		return casper.evaluate(function() {
			return window.isLoadingHidden() && window.isInPage('ANCILLARY_PAGE');
		});
	}, function then() {}, function timeout() {}, 30000);

	casper.then(function() {
		casper.evaluate(function() {
			$('button[data-translate="label.sbmt.continue"]').click();
		});
	});

	casper.waitFor(function() {
		return casper.evaluate(function() {
			return window.isLoadingHidden() && window.isInPage('PURCHASE_PAGE') &&  $('#purchase-form [name="payment-method"]').size() >= 3 && $('#continue').size() > 0;
		});
	}, function then() {}, function timeout() {}, 30000);

	//region PURCHASE_PAGE
	casper.then(function() {
		test.assertEval(function() {
			return window.totalAmount === $('.trip-price .amount').text().trim() && $($('.cart-info').find('.f-title')[0]).text() === window.departureAirport && $($('.cart-info').find('.f-title')[1]).text() === window.arrivalAirport;
		}, 'cart information is correct');

		test.assertEval(function() {
			return $('.trip-price .amount').text().trim() === window.totalAmount;
		}, 'Payment .component.cart.price is present and the amount is correct');

		test.assertEval(function() {
			return $('#purchase-form [name="payment-method"]').size() > 0;
		}, 'form of payments displayed correctly');

		test.assertEval(function() {
			return $('#continue').size() > 0;
		}, 'purchase button displayed correctly');

		test.assertEval(function() {
			return $('#continue')[0].disabled;
		}, 'Check for Continue submit button is disabled');
	});

	casper.then(function() {
		casper.evaluate(function() {
			$('[data-type="CARD"]').click();
		});
	});

	casper.waitFor(function() {
		return casper.evaluate(function() {
			return window.isLoadingHidden() && window.isInPage('PURCHASE_PAGE') &&  $('#payment-details').is(':visible');
		});
	}, function then() {}, function timeout() {}, 30000);

	casper.then(function() {
		casper.evaluate(function() {
			$('input[name="selectedCards[0].cardNumber"]').val(window.creditCardNo);
			$('input[name="selectedCards[0].cardNumber"]').trigger('keyup');
		});
	});

	casper.waitFor(function() {
		return casper.evaluate(function() {
			return window.isLoadingHidden() && window.isInPage('PURCHASE_PAGE') &&  $('#payment-details').is(':visible');
		});
	}, function then() {}, function timeout() {}, 30000);

	casper.then(function() {
		test.assertEval(function() {
			return $('.credit-card-billing-address').size() > 0;
		}, 'Billing Address details form displayed correctly');
	});

	casper.then(function() {
		casper.evaluate(function() {
			$('input[name="selectedCards[0].nameOnCard"]').val(window.nameOnCard);
			$('select[name="selectedCards[0].expDate.month"]').val(window.cardMonth);
			$('select[name="selectedCards[0].expDate.year"]').val(window.cardYear);
			$('input[name="selectedCards[0].cvcNumber"]').val(window.cvcNumber);

			$('input[name="selectedCards[0].billingData.street1"]').val(window.street1);
			$('input[name="selectedCards[0].billingData.street2"]').val(window.street2);
			$('input[name="selectedCards[0].billingData.city"]').val(window.city);
			//$('select[name="selectedCards[0].billingData.province"]').val(window.province);
			$('input[name="selectedCards[0].billingData.zipCode"]').val(window.zipCode);
			$('select[name="selectedCards[0].billingData.country"]').val(window.country);
		});
	});

	casper.then(function() {
		test.assertEval(function() {
			return ($('input[name="selectedCards[0].cardNumber"]').val() == window.creditCardNo);
		}, 'verify card number');

		test.assertEval(function() {
			return ($('input[name="selectedCards[0].nameOnCard"]').val() == window.nameOnCard);
		}, 'verify card name');

		test.assertEval(function() {
			return ($('select[name="selectedCards[0].expDate.month"]').val() == window.cardMonth) && ($('select[name="selectedCards[0].expDate.year"]').val() == window.cardYear);
		}, 'verify card expiry month and year');

		test.assertEval(function() {
			return ($('input[name="selectedCards[0].billingData.street1"]').val() == window.street1) && ($('input[name="selectedCards[0].billingData.street2"]').val() == window.street2);
		}, 'verify card address street');

		test.assertEval(function() {
			return ($('input[name="selectedCards[0].billingData.city"]').val() == window.city) &&
					//($('select[name="selectedCards[0].billingData.province"]').val() == window.province) &&
					($('input[name="selectedCards[0].billingData.zipCode"]').val() == window.zipCode) &&
					($('select[name="selectedCards[0].billingData.country"]').val() == window.country);
		}, 'verify card address city, zipcode and country');
	});

	casper.then(function() {
		casper.evaluate(function() {
			$('button.accept-fop').click();
		});
	});

	casper.then(function() {
		// test.assertEval(function() {
		// 	return $('#agree-chechbox')[0].checked;
		// }, 'Check for checkbox is selected');

		test.assertEval(function() {
			return !$('#continue')[0].disabled;
		}, 'Check for Continue submit button is enabled');
	});

	casper.then(function() {
		casper.evaluate(function() {
			$('#continue').click();
		});
	});

	// casper.waitFor(function() {
	// 	return casper.evaluate(function() {
	// 		return window.isLoadingHidden() && window.isInPage('CONFIRMATION_PAGE');
	// 	});
	// }, function then() {}, function timeout() {}, 40000);

	// casper.then(function() {
	// 	test.assertEval(function() {
	// 		return $('span.code-container').text().length > 0;
	// 	}, 'PNR was succesfully created');
	// });

	casper.run(function() {
		test.done();
	});
});