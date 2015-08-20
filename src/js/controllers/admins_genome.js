
angular.module('RDash').controller('genomeCtrl', ["$scope", "chrBands", "mockedAPI",  
  function($scope, chrBands, mockedAPI) {
   	/*  Draw chromsomes  */ 

   	// Get the data 
    var chromosomeData = _.countBy(chrBands.hg18, 'chr');
    
    // a list of chromosomes 
    $scope.chromosomes = ["chr1", "chr2", "chr3", "chr4", "chr5", "chr6", 
        "chr7", "chr8", "chr9", "chr10", "chr11", "chr12", "chr13", "chr14", 
        "chr15", "chr16", "chr17", "chr18", "chr19", "chr20", "chr21", "chr22", 
        "chrX", "chrY"] 

    // Initialize for the first chromosome option 
    $scope.chr = $scope.chromosomes[0];
    $scope.cytobandData = _.filter(chrBands.hg18, {chr: $scope.chr});
    var heatmapRawData; 
    
    // Get queries data 
    mockedAPI.getQueries().success(function(response){
    	heatmapRawData = response;
    	$scope.heatmapData = _.filter(heatmapRawData, function(obj){
    		return obj.query.chromosome.toLowerCase() === $scope.chr.toLowerCase();
    	});
    });

    $scope.updateChromosome = function(){
    	$scope.cytobandData = _.filter(chrBands.hg18, {chr: $scope.chr});
    	$scope.heatmapData = _.filter(heatmapRawData, function(obj){
    		return obj.query.chromosome.toLowerCase() === $scope.chr.toLowerCase();
    	});
    	
    	// Reset chromosome view to showing 
    	$scope.showBands = true;
    	$scope.toggleChromosome();
    }

    $scope.showBands = true;
    $scope.toggleChromosome = function(){
    	if($scope.showBands == true){
    		$(".chr-bands").fadeIn();
    	} else {
    		$(".chr-bands").fadeOut();
    	}
    }

    /* Date and time range */

    // Set default to one month period 
    $scope.today = new Date();
    var lastMonth = new Date();
    lastMonth.setMonth($scope.today.getMonth() - 1); 

    $scope.BHdate2 = new Date($scope.today); $scope.BHdate1 = new Date(lastMonth);  

    /* Beacon chip search bar */ 
    $scope.searchBarText = "Loading..."
    $scope.readonly = false;
    $scope.selectedItem = null;
    $scope.searchText = null;
    $scope.querySearch = querySearch;
    $scope.beacons = [];
    $scope.selectedBeacons = [];
    $scope.numberChips = [];
    $scope.numberChips2 = [];
    $scope.numberBuffer = '';

    // Search for beacon
    function querySearch (query) {
      var results = query ? $scope.beacons.filter(createFilterFor(query)) : [];
      return results;
    }
    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(beacon) {
        return (beacon._lowername.indexOf(lowercaseQuery) === 0) ||
            (beacon._lowertype.indexOf(lowercaseQuery) === 0);
      };
    }

    mockedAPI.getBeacons().success(function(response){
        var beaconInfo = response; 
        for(i in beaconInfo){
            beaconInfo[i]._lowername = beaconInfo[i].id.toLowerCase();
            beaconInfo[i]._lowertype = beaconInfo[i].organization.id.toLowerCase();
        }
        $scope.beacons = beaconInfo;

        // Update search bar placeholder text 
        $scope.searchBarText = "Search for beacons"; 

    });

}]); 