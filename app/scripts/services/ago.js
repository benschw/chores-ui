'use strict';

angular.module('choresApp').factory('ago', function() {

	// return the beginning of supplied date's cycle frequency
	var defaults = {
		daily: function(d) {
			d.setHours(0,0,0,0); // midnight
			return d;
		},
		weekly: function(d) {
			var day = d.getDay(), diff = d.getDate() - day + (day === 0 ? -6:1); // adjust when day is sunday
			d.setDate(diff);     // monday of week
			d.setHours(0,0,0,0); // midnight
			return d;
		},
		monthly: function(d) {
			d.setDate(1);        // first of month
			d.setHours(0,0,0,0); // midnight
			return d;
		},
		yearly: function(d) {
			d.setMonth(0);       // january
			d.setDate(1);        // 1st
			d.setHours(0,0,0,0); // midnight
			return d;
		}
	};
	
	// normalize two dates to beginning of their cycle frequency,
	// return difference between each (in their cycle frequency units)
	var unitsAgo = {
		daily: function(d, d2) {
			d = defaults.daily(d);
			var today = defaults.daily(d2);
			var timeDiff = Math.abs(d.getTime() - today.getTime());
			return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
		},
		weekly: function(d, d2) {
			d = defaults.weekly(d);
			var monday = defaults.weekly(d2);
			var timeDiff = Math.abs(d.getTime() - monday.getTime());
			return Math.ceil(timeDiff / (1000 * 60 * 60 * 24 * 7));
		},
		monthly: function(d, d2) {
			d = defaults.monthly(d);
			var first = defaults.monthly(d2);
			var d2Months = (12 * first.getFullYear()) + first.getMonth();
			var dMonths = (12 * d.getFullYear()) + d.getMonth();
			return d2Months - dMonths;
		},
		yearly: function(d, d2) {
			d = defaults.yearly(d);
			var jan = defaults.yearly(d2);
			return jan.getFullYear() - d.getFullYear();
		}
	};


	// return # units since liast completion
	// (where units are determined by chore frequency type)
	return function(item) {
		var lastCompleted;

		if (item.tasks && item.tasks.length > 0) {
			// use last time task was completed
			lastCompleted = new Date(item.tasks[0].time);
		} else {
			// if new chore, set to 1ms before the beginning of current cycle
			lastCompleted = defaults[item.type](new Date(item.created));
			lastCompleted.setHours(0,0,0,-1);
		}
		return unitsAgo[item.type](lastCompleted, new Date());
	};
});


