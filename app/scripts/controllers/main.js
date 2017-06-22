'use strict';

/**
 * @ngdoc function
 * @name choresApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the choresApp
 */
angular.module('choresApp')
  .controller('MainCtrl', function ($scope) {
    $scope.things = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
