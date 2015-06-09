var results;
(function( window ) {
	'use strict';

var app = angular.module('app', []);

app.factory("query", ["$http", function($http){
	var query = {};

	var API_ENDPOINT = "http://dnastack.com/bob-api/rest"; 

	query.getBeacons = function(){
		return $http.get(API_ENDPOINT + "/beacons");
	};
	query.getResponse = function(searchString){
		return $http.get(API_ENDPOINT + "/responses" + searchString);
	}; 
	query.getParam = function(url, paramName){
		var params = url.split('&');
		for (var i = 0; i < params.length; i++){
			if (params[i].match(paramName)){
				return params[i].split('=')[1];
			}
		}
	};

	return query;
}]);


app.controller("queryCtrl", ["query", "$scope", function(query, $scope){
	var searchQuery = document.location.search;
	console.log(searchQuery);
	// Get the search parameters 
	$scope.chr = query.getParam(searchQuery, "chrom");
	$scope.pos = query.getParam(searchQuery, "pos");
	$scope.allele = query.getParam(searchQuery, "allele");
	$scope.ref = query.getParam(searchQuery, "ref");

	// Get the true/false results 
	query.getResponse(searchQuery).success(function(response){
		$scope.data = response;
	})
	
}]);


})( window );

