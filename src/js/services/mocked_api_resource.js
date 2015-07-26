/* 
	Mocked API: currently under construction. 
*/ 

angular.module("RDash").factory("mockedAPI2", ['$resource', function($resource) {
	var API_ENDPOINT = "http://private-20779-beacon7.apiary-mock.com";
 
	return {

		/* Return information about queries and responses that have been made to a beacon */ 
		getBeaconResponses: function(beaconID) {
	    	return $resource(API_ENDPOINT + '/beacons/:beaconID/responses', {}, {
		      query: {method:'GET', params:{beaconID:beaconID}, isArray:true}, 
		      get: {method:'GET', interceptor: {
		      	response: function(response){
		      		var result = response.resource; 
		      		result.$status = response.status; 
		      		return result; 
		      	}
		      }}
		    });
		}
	};
}]);