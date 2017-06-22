'use strict';

/**
 * @ngdoc overview
 * @name choresApp
 * @description
 * # choresApp
 *
 * Main module of the application.
 */
angular.module('choresApp', [
	'ngAnimate',
	'ngCookies',
	'ngResource',
	'ngRoute',
	'ngSanitize',
	'ngTouch',
	'ui.router'
])

.config(function ($routeProvider, $stateProvider, $urlRouterProvider) {
	$urlRouterProvider
		.otherwise('/');



	$stateProvider
		.state({
			name: 'home',
			url: '/',
			controller: 'MainCtrl',
			templateUrl: 'views/main.html'
		})
		.state({
				name: 'config',
				url: '/config',
				controller: 'ConfigCtrl',
				templateUrl: 'views/config.html'
		});

});
