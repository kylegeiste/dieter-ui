//dieter v1
//by kyle geiste on MEAN stack
//who didn't know much of what he was doing

//creates instance of angular app called dieter with array of dependencies
var app = angular.module('dieter', ['ui.router']);


//app.config creates routes and other URL behavior via ui-router
//stateProvider creates specific routes
//urlRouterProvider handles and non-routed URLs

app.config(function($stateProvider, $urlRouterProvider) {

		//'otherwise' method sends all invalid/unspecified to 'home' route
		$urlRouterProvider.otherwise('home');

		
		$stateProvider

		//create state route for 'home' using MainCtrl controller
		.state('home', {
			url: "/home",
			templateUrl: "/home.html",
			controller: "MainCtrl"
		})

		//create state route for 'posts' with post id parameter using PostsCtrl controller
		.state('posts', {
			url: "/posts/{id}",
			templateUrl: "/posts.html",
			controller: "PostsCtrl"
		});

	});

//app.factory creates 'posts' as a service available to all controllers, rather than storing data within the primary controller
//factory contains a posts model, consisting of an array, stored privately in variable 'o'
//a factory is something that takes data from the controller and does something with it

app.factory('posts', [function(){
	var o = {
		posts: [
		{title: 'default 1', url: "www.example.com", upvotes: 5},
		{title: 'default 2', url: "www.example.com", upvotes: 6}
		]
	};
	return o;
}]);

/*
- app.controller creates controller called 'MainCtrl'
- $scope is the object that contains all necessary angular functions, and acts as a bridge between controller and view
- posts is a factory, defined above, injected into the MainCtrl controller that enables storage and usage of posts object, outside of the controller (if you want to use something in a controller, you have to inject it)
- all variables/functions available to MainCtrl must go inside of $scope function 
*/

app.controller('MainCtrl', [
	'$scope',
	'posts',
	function($scope, posts){
		
		//test is a throwaway variable within object $scope
		$scope.test = 'Hello world!';

		//setting 'posts' variable within $scope to mirror 'posts' variable within 'posts' factory
		//uses $stateParams.id to associate each post with id in array
		$scope.posts = posts.posts;

		//addPost function adds a post to the posts array
		$scope.addPost = function() {

			//if submitted title or URL is blank, do not add to array, and log it
			if(!$scope.title || $scope.title === '' || !$scope.url || $scope.url === '' ) { console.log("Bad link!"); return; }

			//add 'post' using contents of 'title' field as title and contents of 'url' field as url
			$scope.posts.push({
				title: $scope.title, 
				url: $scope.url, 
				upvotes: 0,
				//inject fake comments for testing
				comments: [
				{author: 'Joe', body: 'Cool post!', upvotes: 0},
				{author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0}
				]
			});

			//reset 'title' field to blank after submit
			$scope.title = "";
			$scope.url = "";
		};

		//incrementUpvotes function takes one object, 'post', and increments 'upvotes' for the object when called
		//because it is run within 'posts' loop, it increments the upvotes of the 'post' it is a part of

		$scope.incrementUpvotes = function(post) {
			post.upvotes +=1;
		}


	}]);
// creates PostsCtrl controller for handling individual post pages, injecting posts factory so that we can show comment data from posts on each post

app.controller('PostsCtrl', [
	'$scope',
	'$stateParams',
	'posts',
	function($scope, $stateParams, posts){

		$scope.post = posts.posts[$stateParams.id];

		$scope.addComment = function(){
			
			if($scope.body === ''){ return; }
			
			$scope.post.comments.push({
				body: $scope.body,
				author: 'user',
				upvotes: 0
			});

			$scope.body = '';
		};

	}]);


