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
			name: 'daily',
			url: '/',
			controller: 'TaskCtrl',
			templateUrl: 'views/daily.html'
		})
		.state({
			name: 'weekly',
			url: '/weekly/',
			controller: 'TaskCtrl',
			templateUrl: 'views/weekly.html'
		})
		.state({
			name: 'monthly',
			url: '/monthly/',
			controller: 'TaskCtrl',
			templateUrl: 'views/monthly.html'
		})
		.state({
			name: 'yearly',
			url: '/yearly/',
			controller: 'TaskCtrl',
			templateUrl: 'views/yearly.html'
		})
		.state({
				name: 'config',
				url: '/config',
				controller: 'ConfigCtrl',
				templateUrl: 'views/config.html'
		});

});
