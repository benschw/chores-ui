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

    $scope.things = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
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
	
	refreshChores();

	$scope.addChore = function(choreType) {
		$http({
			method: 'POST',
			url: '/api/chore',
			data: { type: choreType, content: $scope.newDaily }
		}).then(function(){
			refreshChores();
		}, function(){
			console.log('error adding chore');
		});
	};
	$scope.deleteChore = function(id) {
		$http({
			method: 'DELETE',
			url: '/api/chore/' + id
		}).then(function(){
			refreshChores();
		}, function(){
			console.log('error removing chore');
		});
	};

	$scope.newDaily = '';
	$scope.newWeekly = '';
	$scope.newMonthly = '';
	$scope.newYearly = '';

  });
