
angular.module('RDash').controller('genomeCtrl', ["$scope", "chrBands", "mockedAPI",  
  function($scope, chrBands, mockedAPI) {


  	// Draw chromsomes 
    var chromosomeData = _.countBy(chrBands.hg18, 'chr');
    var chromosomeArray =  _.keys(chromosomeData);

    $scope.chromosomes = chromosomeArray; 
    $scope.chr = $scope.chromosomes[0];
    console.log($scope.chr);
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
    }



 
}]); 