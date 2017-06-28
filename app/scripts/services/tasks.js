'use strict';

angular.module('choresApp').factory('tasks', ['$http', 'ago', function($http, ago) {
	var tasks = {};

	var getTaskStatus = function(item) {

		var unitsSince = ago(item);
		
		var due;
		var overdue;
		if (unitsSince < 1) {
			due = false;
			overdue = 0;
		} else if (unitsSince < 2) {
			due = true;
			overdue = 0;
		} else if (unitsSince < 3) {
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
}]);

