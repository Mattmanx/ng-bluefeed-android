'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('blueFeed.services', ['ngResource'])
  .value('bfBaseUrl', 'https://bfapp-bfsharing.rhcloud.com')
  .factory('Auth', ['$http', 'bfBaseUrl', function(http, baseUrl) {
	  return {
		  login : function(userId, password) {
			  //baseUrl = http + /login
			  //get name, pwd from sig
			  //do a post
			  //return promise
			  //may need to set request with credentials flag
			  var endpoint = baseUrl + "/login";
			  return http.post(endpoint,{"name" : userId, "pwd" : password, "rememberme" : "false"});
		  },
		  logout : function() {
			  //no params
			  var endpoint = baseUrl + "/logout";
			  return http.post(endpoint);
		  },
		  retrieveUser : function(userId) {
			  var endpoint = baseUrl + "/user/" + userId;
			  return http.get(endpoint);
		  },
		  profilePicture : function(userId, file) {
			  var endpoint = baseUrl + "/user/" + userId + "/profilepic";
			  return http.post(endpoint,{"imageFile" : file});
		  }
	  }
  }])
  .factory('Posts', ['$resource', 'bfBaseUrl', function($resource, baseUrl) {
	  var endpoint = baseUrl + "/post";
	  return $resource(endpoint);
  }])
  .factory('Comments', ['$http', 'bfBaseUrl', function($http, baseUrl) {
	  var endpoint = baseUrl + "/comment";
	  return {
		  save : function(user, postId, commentText) {
			  return $http.post(endpoint, {"username" : user, "postId" : postId, "commentText" : commentText});
		  }
	  }
  }]);