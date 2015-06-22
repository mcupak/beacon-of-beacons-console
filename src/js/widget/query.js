var beaconData;

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
	$scope.ref = query.getParam(searchQuery, "ref");

	// d3 chart configuration 
	$scope.responses = [];
	$scope.colors = ['green', 'red', 'orange'];
	$scope.categories = ['Yes', 'No', 'Null'];
	// Response Summary for d3 chart 
	// $scope.responses = [
	// 	{
	// 		'response': 'yes', 
	// 		'color' : "green", 
	// 		'number': 0
	// 	}, 
	// 	{
	// 		'response': 'no', 
	// 		'color' : "red", 
	// 		'number': 0
	// 	}, 
	// 	{
	// 		'response': 'null', 
	// 		'color' : "orange", 
	// 		'number': 0
	// 	}
	// ];


	
	if ($scope.ref == ""){
		$scope.ref = "All"
	}

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
		console.log(response);
		beaconData = response;
		document.getElementById("loading").remove();
		$scope.responses = [countResponse(response, true), 
			countResponse(response, false), countResponse(response, null)];
		// $scope.responses[0].number = countResponse(response, true); 
		// $scope.responses[1].number = countResponse(response, false); 		
		// $scope.responses[2].number = countResponse(response, null);
		
		console.log($scope.responses);

	}).then(function(response){
		//console.log(response);
		//console.log(response.data.length);

	});
}]);


})( window );

