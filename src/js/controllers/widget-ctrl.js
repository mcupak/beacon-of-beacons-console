app.controller("widgetCtrl", function(query, $q, $http, $scope){
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
	
});
