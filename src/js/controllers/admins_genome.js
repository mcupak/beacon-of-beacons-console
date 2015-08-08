
angular.module('RDash').controller('genomeCtrl', ["$scope", "chrBands", "mockedAPI",  
  function($scope, chrBands, mockedAPI) {
   	/*  Draw chromsomes  */ 

   	// Get the data 
    var chromosomeData = _.countBy(chrBands.hg18, 'chr');
    var chromosomeArray =  _.keys(chromosomeData);
    
    // Get a list of chromosomes 
    $scope.chromosomes = chromosomeArray; 

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



 
}]); 