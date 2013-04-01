'use strict';

/* Controllers */
angular.module('blueFeed.controllers', [])

.controller('AuthCtrl', ['$scope', '$routeParams', 'Auth', function AuthCtrl($scope, $routeParams, Auth) {
	$("body").removeClass("nav-bar-body");
	$scope.buttonText = "Go!";
	
    $scope.login = function() {
    	$scope.buttonText = "Processing...";
    	$("#loginSubmit").addClass("disabled");
    	$scope.errors = [];
    	$scope.infos = [];
    	
    	//keep the user in local session. placeholder for now, we'll validate after login. 
    	sessionStorage.user = $scope.user;
    	Auth.login($scope.user, $scope.pass)
    		.success(function(data, status, headers, config) {
    			$scope.$navigate.go('/ng_feeds');
    			$("#submitButton").removeClass("disabled");
    			$scope.buttonText = "Go!";
    		})
    		.error(function(data, status, headers, config) {
    			sessionStorage.user = undefined;
    			if(status == 400) {
    				// Assuming 'Bad Request' = bad credentials
    				$scope.errors.push('Invalid user name / password. Please try again.');
    			} else {
    				// Some other server problem. 
    				$scope.errors.push('An error occurred signing you in. Please try again later.');
    			}
    			
    			$("#loginSubmit").removeClass("disabled");
    			$scope.buttonText = "Go!";
    		});
    }
}])

.controller('FeedCtrl', ['$scope', '$routeParams', 'bfBaseUrl', 'Posts', 'Comments', 
                         function FeedCtrl($scope, $routeParams, baseUrl, Posts, Comments) {
	$("body").addClass("nav-bar-body");
			
	$scope.retrievePosts = function() {
		return Posts.query(
			{"username" : sessionStorage.user}, 
			function() {}, 
			function(data, status, headers, config) {
				if(status == 400 || status == 401) {
					//assuming not logged in. redirect to login page. 
					$scope.errors.push('Please sign in to continue.');
					$scope.$navigate.go('/ng_login');
				} else {
					$scope.errors.push('An error occurred retrieving messages. Please try again later.');
				}
		});
	}
	
	//immediate return of empty var, model binding will auto-update in view after return. 
	//$scope.posts = Posts.get(/* params */, /* success */, /* failure */);
	$scope.posts = $scope.retrievePosts();
	
	$scope.addComment = function(post) {
		var postId = post._id;
		var comment = post.newCommentText;
		var user = sessionStorage.user;
		post.errors = {};
		
		post.errors = [];		
		Comments.save(user, postId, comment)
			.success(function() {
				$scope.posts = $scope.retrievePosts();
			})
			.error(function() {
				post.errors.push("Error saving comment.");
			});
		
	}
	
	//need baseURL for images (not enough time to write a model transform right now, so just going to do it in the DOM)
	$scope.baseUrl = baseUrl;
}])

.controller('PostCtrl', ['$scope', '$routeParams', 'bfBaseUrl', 'Posts', 
                         function FeedCtrl($scope, $routeParams, baseUrl, Posts) {
	
	$scope.postTopic = function() {
		$scope.errors = [];
		Posts.save({},{"username" : sessionStorage.user, "postText" : $scope.postContents}, 
				function() {
					$scope.$navigate.go('/ng_feeds');
				},
				function() {
					$scope.errors.push("An error occurred while saving your post.");
				});
	}
}])

.controller('UserCtrl', ['$scope', '$navigate', 'Auth', 'bfBaseUrl', function($scope, $navigate, Auth, baseUrl) {
	Auth.retrieveUser(sessionStorage.user).success(function(data) {
		$scope.userProfile = data;
	});
	
	$scope.baseUrl = baseUrl;
	
	$scope.profileUpload = function() {
		$scope.errors = [];
		navigator.camera.getPicture(
			function(imageData) {
				//success
				Auth.profilePicture(sessionStorage.user, imageData)
					.success(function() {
						$scope.errors.push("Profile update successful.");
					})
					.error(function() {
						$scope.errors.push("An error occurred while uploading your profile image.");
					});
			},
			function(message) {
				//failure
				$scope.errors.push("An error occurred while taking your profile image.");
			}),
			{quality: 50, destinationType: Camera.DestinationType.DATA_URL}
	
	};
}])

/* Main controller... all other controllers inherit scope from this guy. Easy access to 
 * navigate and other common dependencies. */
.controller('MainCtrl', ['$scope', '$navigate', 'Auth', function($scope, $navigate, Auth) {
	$scope.$navigate = $navigate;
	$scope.errors = [];
	$scope.infos = [];
	
	// This is kind of crazy, but there's no complete() in Angular's promise API..
	$scope.logout = function () {
		$scope.infos = [];
		Auth.logout()
			.success(function() {
				$scope.infos.push('You have successfully logged out.');
				$scope.$navigate.go('/ng_login', 'modal');
				sessionStorage.user = "";
			})
			.error(function() {
				$scope.infos.push('You have successfully logged out.');
				$scope.$navigate.go('/ng_login', 'modal');
				sessionStorage.user = "";
			});
	}
}]);

