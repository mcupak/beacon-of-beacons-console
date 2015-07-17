/**
 * Beacon performance display controller 
 */
angular.module('RDash').controller('performanceCtrl', ['$scope', "mockedAPI",
 function($scope, mockedAPI) {

    // Coloring of the donut charts for [yes, no, null/error]
    $scope.colors = ["green", "red", "orange"];
    
    /*
     *  Groups responses based on beacon
     */
    function groupResponsesByBeacon(data) {

        var groupedResponse = {};

        for (var i = 0; i < data.length; i++) {
            var beaconID = data[i].beacon.id;
            
            if (groupedResponse[beaconID] == undefined)
                groupedResponse[beaconID] = [data[i]];
            else
                groupedResponse[beaconID].push(data[i]);
        }
        return groupedResponse;

    }

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

    // Get beacon response summary 
    mockedAPI.getQueries().success(function(response){
        $('#beacon-summary').remove();
       //var groupedResponse = groupResponsesByBeacon(response);
       //$scope.summary = summarizeResponse(groupedResponse);
    });


    /* Histogram */ 

    $scope.data = [
        {
            "name": "bob",
            "nqueries": 20
        },
        {
            "name": "amp",
            "nqueries": 25
        },
        {
            "name": "amb",
            "nqueries": 10
        },

        {
            "name": "bo3",
            "nqueries" : 0
        },
        {
            "name": "amp2",
            "nqueries": 25
        },
        {
            "name": "lamb2",
            "nqueries": 10
        },

        {
            "name": "bo2",
            "nqueries" : 0
        },
        {
            "name": "bob2",
            "nqueries" : 5
        }
    ];
    

    /* Beacon chip search bar */ 

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
        var beaconInfo = response; 
        for(i in beaconInfo){
            beaconInfo[i]._lowername = beaconInfo[i].id.toLowerCase();
            beaconInfo[i]._lowertype = beaconInfo[i].organization.id.toLowerCase();                
        }
        $scope.beacons = beaconInfo;
        
        //$("md-autocomplete").attr("placeholder", "Search for beacons"); //cannot work 
       
    });


}]);