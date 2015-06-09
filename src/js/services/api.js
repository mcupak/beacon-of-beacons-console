angular.module("RDash").factory("API", function($http) {
	var API_ENDPOINT = "http://dnastack.com/bob-api/rest"; 

	return {
		getBeacons: function() {
			return $http.get(API_ENDPOINT + "/beacons");
		},
		getResponse: function(searchString) {
			return $http.get(API_ENDPOINT + "/responses" + searchString);
		}
	};
});