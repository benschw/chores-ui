'use strict';

angular.module('choresApp').factory('tasks', function($http) {
	var tasks = {};


	var agoCalc = {
		daily: function(d) {
			var today = new Date();
			today.setHours(0,0,0,0);
			var timeDiff = Math.abs(d.getTime() - today.getTime());
			return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
		},
		weekly: function(d) {
			var today = new Date();
			var day = today.getDay(), diff = today.getDate() - day + (day === 0 ? -6:1); // adjust when day is sunday
			today = new Date(today.setDate(diff));
			console.log(d);

		},
		monthly: function(d) {
			var today = new Date();
			today = new Date(today.getFullYear(), today.getMonth(), 1);
			console.log(d);
		},
		yearly: function(d) {
			var today = new Date();
			return today.getFullYear() - d.getFullYear();
		}
	};

	var defaults = {
		daily: function(item) {
			var d = new Date(item.created);
			d.setHours(0,0,0,-1); //1ms before midnight: yesterday
			return d;
		},
		weekly: function(item) {
			var date = new Date(item.created);
			var day = date.getDay(), diff = date.getDate() - day + (day === 0 ? -6:1); // adjust when day is sunday
			var d = new Date(date.setDate(diff));
			d.setHours(0,0,0,-1); //1ms before midnight
			return d;
		},
		monthly: function(item) {
			var date = new Date(item.created);
			var d = new Date(date.getFullYear(), date.getMonth(), 1);
			d.setHours(0,0,0,-1); //1ms before midnight
			return d;
		},
		yearly: function(item) {
			var date = new Date(item.created);
			var d = new Date(date.getFullYear(), 0, 1);
			d.setHours(0,0,0,-1); //1ms before midnight
			return d;
		}
	};

	var getTaskStatus = function(item) {
		var lastCompleted;

		if (item.tasks && item.tasks.length > 0) {
			lastCompleted = new Date(item.tasks[0].time);
			lastCompleted.setHours(0,0,0,0);
		} else {
			lastCompleted = defaults[item.type](item);
		}
		var ago = agoCalc[item.type](lastCompleted);
		
		var due;
		var overdue;
		if (ago < 1) {
			due = false;
			overdue = 0;
		} else if (ago < 2) {
			due = true;
			overdue = 0;
		} else if (ago < 3) {
			due = true;
			overdue = 1;
		} else {
			due = true;
			overdue = 2;
		}

		return {
			due: due,
			overdue : overdue
		};
	};

	var processTasks = function(data) {
		tasks.daily = [];
		tasks.weekly = [];
		tasks.monthly = [];
		tasks.yearly = [];
		for (var i = 0; i < data.length; i++) {
			var item = data[i];
			var s = getTaskStatus(item);
			
			item.due = s.due;
			if (s.overdue >= 2) {
				item.className = 'list-group-item-danger';
			} else if (s.overdue === 1) {
				item.className = 'list-group-item-warning';
			}
			tasks[item.type].push(item);
		}
		console.log(tasks);
	};

	var refreshTasks = function() {
		$http({
			method: 'GET',
			url: '/api/task'
		}).then(function(response) {
			processTasks(response.data);
		}, function() {
			console.log('error loading tasks');
		});
	};
	return {
		load: function() {
			refreshTasks();
			return tasks;
		},
		doWork: function(task) {
			var now = new Date();
			$http({
				method: 'POST',
				url: '/api/work',
				data: {'chore-id': task.id, time: now.toISOString()}
			}).then(function() {
				refreshTasks();
			}, function() {
				console.log('problem checking off task');
			});
			console.log(['doWork', task.id]);
		},
		undoWork: function(task) {
			$http({
				method: 'Delete',
				url: '/api/work/' + task.tasks[0].id,
			}).then(function() {
				refreshTasks();
			}, function() {
				console.log('problem un-checking task');
			});
			console.log(['undoWork', task.id]);
		}
	};
});

