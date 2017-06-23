'use strict';

/**
 * @ngdoc function
 * @name choresApp.controller:ConfigCtrl
 * @description
 * # ConfigCtrl
 * Controller of the choresApp
 */
angular.module('choresApp')
  .controller('ConfigCtrl', function ($scope, $http) {



    $scope.choreTypes = ['daily', 'weekly', 'monthly', 'yearly'];
	$scope.newChores = {};
	$scope.choreTypes.forEach(function(choreType) {
	    $scope.newChores[choreType] = null;
	});

	$scope.chores = [];

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
			data: { type: choreType, content: $scope.newChores[choreType] }
		}).then(function(){
			$scope.newChores[choreType] = null;
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
	
  });
