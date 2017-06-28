'use strict';

/**
 * @ngdoc function
 * @name choresApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the choresApp
 */
angular.module('choresApp').controller('TaskCtrl', [ '$scope', '$http', 'tasks',
	function ($scope, $http, tasks) {
	
		$scope.tasks = tasks.load();

		$scope.doWork = tasks.doWork;
		$scope.undoWork = tasks.undoWork;

}]);
