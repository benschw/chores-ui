'use strict';

/**
 * @ngdoc function
 * @name choresApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the choresApp
 */
angular.module('choresApp')
  .controller('ConfigCtrl', function ($scope, $http) {

    $scope.chores = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

	var refreshChores = function() {
		$http({
			method: 'GET',
			url: '/api/chore'
		}).then(function(response) {
			$scope.chores = response.data;
		}, function() {
			console.log('error loading chores');
		});
	};
	

	$scope.addChore = function(choreType) {
		console.log([$scope.newDaily, choreType]);
		var req = {
			method: 'POST',
			url: '/api/chore',
			data: { type: choreType, content: $scope.newDaily }
		};

		$http(req).then(function(){
			refreshChores();
		}, function(){
			console.log('error adding chore');
		});
	};

	$scope.newDaily = '';
	$scope.newWeekly = '';
	$scope.newMonthly = '';
	$scope.newYearly = '';

  });
