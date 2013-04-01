'use strict';

// Declare app level module which depends on filters, and services
angular.module('blueFeedApp', ['mobile-navigate', 'blueFeed.controllers', 'blueFeed.filters', 'blueFeed.services', 'blueFeed.directives']).
	config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
		//$locationProvider.html5Mode(true);
		$routeProvider.when('/ng_login', {templateUrl: 'partials/login.html', controller: 'AuthCtrl'});
		$routeProvider.when('/ng_feeds', {templateUrl: 'partials/feeds.html', controller: 'FeedCtrl'});
		$routeProvider.when('/ng_post', {templateUrl: 'partials/post.html', controller: 'PostCtrl'});
		$routeProvider.when('/ng_user', {templateUrl: 'partials/user.html', controller: 'UserCtrl'});
		$routeProvider.otherwise({redirectTo: '/ng_login'});
	}])
	.run(function($route, $http, $templateCache) {
		angular.forEach($route.routes, function(r) {
			if (r.templateUrl) { 
				$http.get(r.templateUrl, {cache: $templateCache});
			}
		});
	});
