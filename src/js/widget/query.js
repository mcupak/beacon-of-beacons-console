(function( window ) {
	'use strict';

var app = angular.module('RDash', []);

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
	
	// Get the search parameters 
	$scope.chr = query.getParam(searchQuery, "chrom");
	$scope.pos = query.getParam(searchQuery, "pos");
	$scope.allele = query.getParam(searchQuery, "allele");

	// d3 chart configuration 
	$scope.responses = [];
	$scope.colors = ['green', 'red', 'orange'];
	$scope.categories = ['Yes', 'No', 'Error'];
	

	$("barchart").hide();

	// Count response types
	var countResponse = function(data, response){
		var count = 0;
		for (var i = 0; i < data.length; i++){
			if(data[i].response == response){
				count ++;
			}
		}
		return count;
	}

	// Get the true/false results 
	query.getResponse(searchQuery).success(function(response){
		$scope.data = response;
		document.getElementById("loading").remove();
		$("barchart").show();
		$scope.responses = [countResponse(response, true), 
			countResponse(response, false), countResponse(response, null)];

	});
}]);


})( window );

