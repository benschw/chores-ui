'use strict';

angular.module('choresApp').factory('tasks', ['$http', 'ago', function($http, ago) {
	var types = ['daily', 'weekly', 'monthly', 'yearly'];
	var tasks = {};
	
	var newModel = function() {
		return {
			complete: 0,
			statusClassName: '',
			mostOverdue: 0,
			tasks: []
		};
	};

	var resetModel = function() {
		for (var i=0; i<types.length; i++) {
			tasks[types[i]] = newModel();
		}
	};
	resetModel();

	var processTasks = function(data) {
		resetModel();

		for (var i = 0; i < data.length; i++) {
			var item = data[i];
			var lastCompleted = ago(item);
			
			item.due = lastCompleted >= 1;
			if (lastCompleted >= 3) {
				item.className = 'list-group-item-danger';
			} else if (lastCompleted === 2) {
				item.className = 'list-group-item-warning';
			}
			tasks[item.type].mostOverdue = Math.max(tasks[item.type].mostOverdue, lastCompleted);
			if (!item.due) {
				tasks[item.type].complete++;
			}
			tasks[item.type].tasks.push(item);
		}
		for (i=0; i<types.length; i++) {
			console.log(['huh', tasks[types[i]].complete, tasks[types[i]].tasks.length]);
			if (tasks[types[i]].complete === tasks[types[i]].tasks.length) {
				tasks[types[i]].statusClassName = 'list-group-item-success';
			} else if (tasks[types[i]].mostOverdue >= 3) {
				tasks[types[i]].statusClassName = 'list-group-item-danger';
			} else if (tasks[types[i]].mostOverdue === 2) {
				tasks[types[i]].statusClassName = 'list-group-item-warning';
			}
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

