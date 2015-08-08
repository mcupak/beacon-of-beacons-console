
angular.module('RDash').controller('genomeCtrl', ['$scope', "chrBands",  
  function($scope, chrBand) {

    var chromosomeData = _.countBy(chrBand.hg18, 'chr');
    var chromosomeArray =  _.keys(chromosomeData);

    $scope.chromosomes = chromosomeArray; 
    $scope.chr = $scope.chromosomes[0];
    $scope.cytobandData = _.filter(chrBand.hg18, {chr: $scope.chr});

    $scope.updateChromosome = function(){
    	 $scope.cytobandData = _.filter(chrBand.hg18, {chr: $scope.chr});
    }


 
}]); 