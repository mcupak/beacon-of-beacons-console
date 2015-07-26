/* 
	Mocked API: currently under construction. 
*/ 

angular.module("RDash").factory("mockedAPI", ['$http', function($http) {
	var API_ENDPOINT = "http://private-20779-beacon7.apiary-mock.com";
 
	return {
		/* Return information about all beacons, as well as their organizations */ 
		getBeacons: function() {
			return $http.get(API_ENDPOINT + "/beacons");
		},

		/* Return information about queries and responses that have been made to all beacons */ 
		getQueries: function() {
			return $http.get(API_ENDPOINT + "/beacons/responses");
		},

		/* Return information about queries and responses that have been made to a beacon */ 
		getBeaconResponses: function(beaconID) {
			return $http.get(API_ENDPOINT + "/beacons/" + beaconID + "/responses");
		}
	};
}]);