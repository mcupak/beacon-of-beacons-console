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

    mockedAPI.getQueries().success(function(response){
       var groupedResponse = groupResponsesByBeacon(response);
       $scope.summary = summarizeResponse(groupedResponse);
    });

}]);