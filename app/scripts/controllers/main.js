'use strict';

/**
 * @ngdoc function
 * @name choresApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the choresApp
 */
angular.module('choresApp').controller('MainCtrl', function ($scope, $http) {
	$scope.tasks = [];

	var today = new Date();
	today.setHours(0,0,0,0);

	var daysAgo = function(d) {
		d.setHours(0,0,0,0);
		var timeDiff = Math.abs(d.getTime() - today.getTime());
		return Math.ceil(timeDiff / (1000 * 3600 * 24));
	};

	var processTasks = function(data) {
		var tasks = [];
		for (var i = 0; i < data.length; i++) {
			var item = data[i];
			if (item.tasks && item.tasks.length > 0) {
				item.lastCompleted = new Date(item.tasks[0].time);
				
			} else {
				var d = new Date();
				d.setDate(d.getDate() - 400);

				item.lastCompleted = d;
			}
			item.due = today.getTime() > item.lastCompleted.getTime();
			if (daysAgo(item.lastCompleted) >= 2) {
				item.className = 'list-group-item-danger';
			} else if (daysAgo(item.lastCompleted) >= 2) {
				item.className = 'list-group-item-warning';
			}
			tasks.push(item);
		}
		console.log(tasks);
		$scope.tasks = tasks;
	};
	
	var refreshTasks = function() {
		$http({
			method: 'GET',
			url: '/api/task/daily'
		}).then(function(response) {
			processTasks(response.data);
		}, function() {
			console.log('error loading tasks');
		});
	};
	
	refreshTasks();

	$scope.doWork = function(task) {
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
	};

	$scope.undoWork = function(task) {
		$http({
			method: 'Delete',
			url: '/api/work/' + task.tasks[0].id,
		}).then(function() {
			refreshTasks();
		}, function() {
			console.log('problem un-checking task');
		});
		console.log(['undoWork', task.id]);
	};

});
