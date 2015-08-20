/**
 * Beacon performance display controller 
 */
angular.module('RDash').controller('performanceCtrl', ['$scope', '$timeout', "mockedAPI", 
 function($scope, $timeout, mockedAPI) {

    /* Default Settings and dropdown options */
   
    // Options to display number of beacons 
    $scope.displayOpts = ["Top 10", "Top 20", "Top 30", "All"];
    $scope.displayOpt = $scope.displayOpts[0]; 

    // Chromosome choices: 
    $scope.chromosomes = ["All","CHR1","CHR2","CHR3","CHR4","CHR5","CHR6","CHR7","CHR8",
                            "CHR9","CHR10","CHR11","CHR12","CHR13","CHR14","CHR15",
                            "CHR16","CHR17","CHR18","CHR19","CHR20","CHR21",
                            "CHR22","X","Y","MT"];
    $scope.chr = $scope.chromosomes[0];
    $scope.geneChr = $scope.chromosomes[0];

    // Allele choices: 
    $scope.alleles = ["All", "A", "T", "C", "G"];
    $scope.allele = $scope.alleles[0];

    // Coloring of the donut charts for [yes, no, null/error]
    $scope.colors = ["green", "red", "orange"];

    // Default Date for filtering: one month

    $scope.today = new Date();
    var lastMonth = new Date();
    lastMonth.setMonth($scope.today.getMonth() - 1); 

    $scope.BUdate2 = new Date($scope.today); $scope.BUdate1 = new Date(lastMonth);
    $scope.BRdate2 = new Date($scope.today); $scope.BRdate1 = new Date(lastMonth);
    $scope.BLdate2 = new Date($scope.today); $scope.BLdate1 = new Date(lastMonth);
    $scope.ULdate2 = new Date($scope.today); $scope.ULdate1 = new Date(lastMonth);
    $scope.PGdate2 = new Date($scope.today); $scope.PGdate1 = new Date(lastMonth); 

    $scope.format = 'yyyy-MM-dd';
    /*
     *  Count number of responses in an array of response object 
    */
    function countResponseType(responses, type){

        var count = 0;
        for (var i = 0; i < responses.length; i++) {
            if(responses[i].response == type)
                count ++;
        }
        return count;
    }

    /*
     *  Groups responses based on beacon
     */
    function summarizeResponse(groupedResponse) {

        var summary = {};

        for (beaconID in groupedResponse) {
            var array = groupedResponse[beaconID];
            var nQuery = groupedResponse[beaconID].length;
            var nTrue = countResponseType(array, true);
            var nFalse = countResponseType(array, false);
            var nNull = countResponseType(array, null);

            summary[beaconID] = {
                "nResponse": [nTrue, nFalse, nNull],
                "nQuery": nQuery, 
                "beacon": array[0].beacon
            }
        }

        return summary;

    }

    /* Histogram */ 

    // fake data 
    $scope.data = [
        {"name":"amb","nqueries":15},
        {"name":"amp","nqueries":30},
        {"name":"amp2","nqueries":25},
        {"name":"bo2","nqueries":18},
        {"name":"bo3","nqueries":13},
        {"name":"bob","nqueries":20},
        {"name":"bob2","nqueries":5},
        {"name":"lamb2","nqueries":10}];

    $scope.data2 = [
        {"name":"cftr","nqueries":15},
        {"name":"brca1","nqueries":30},
        {"name":"bcl2","nqueries":25},
        {"name":"cd4","nqueries":18},
        {"name":"il2","nqueries":13},
        {"name":"myc","nqueries":20},
        {"name":"raf","nqueries":5},
        {"name":"egfr","nqueries":10}];

    // donut chart data
    $scope.donutData = [2,2,3];
    
    // real data 
    $scope.beaconResponsesN = []; 

    /*
    * Given a list of beacons, get total number of responses for each beacon 
    */ 
    function getQueryCount(beacons){
        for(i in beacons){
            mockedAPI.getBeaconResponses(beacons[i].name).then(function(response, 
                status, headers, config ){
                $scope.beaconResponsesN.push(
                {"name": response.data[0].beacon.id, 
                "nqueries": response.data.length});
            });
        }
    }


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
       console.log(response);
       getQueryCount(response);
        var beaconInfo = response; 
        for(i in beaconInfo){
            beaconInfo[i]._lowername = beaconInfo[i].id.toLowerCase();
            beaconInfo[i]._lowertype = beaconInfo[i].organization.id.toLowerCase();
        }
        $scope.beacons = beaconInfo;

        // Update search bar placeholder text 
        $scope.searchBarText = "Search for beacons"; 

    });


    // Show the bootstrap dropdown select
    $(document).ready(function() {
        $timeout(function(){$('.selectpicker').selectpicker();}, 2000); 
       
    });



}]);

