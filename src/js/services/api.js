angular.module("RDash").factory("API", ['$http', function($http) {
	var API_ENDPOINT = "https://beacon-network.org/api";
 
	return {
		getBeacons: function() {
			return $http.get(API_ENDPOINT + "/beacons");
		},
		getResponse: function(searchString) {
			return $http.get(API_ENDPOINT + "/responses" + searchString);
		}
	};
}]);
