/**
 * Beacon Controller
 */
 
angular.module('RDash')
.controller('BeaconWidgetCtrl', ['$scope', 'API', function($scope, API) {
 
    function groupResponseByOrganization(response) {
        var groupedResponse = {};
        for (var i = 0; i < response.length; i++) {
            var current = response[i];
            if (groupedResponse[current.organization] === undefined) {
                var object = [{"name": current.name, "aggregator": current.aggregator, "id":current.id}];
                groupedResponse[current.organization] = object;
            }
            else {
                groupedResponse[current.organization].push({"name": current.name, "aggregator": current.aggregator, "id":current.id});
            }
        }
        return groupedResponse;
    }
 
    API.getBeacons()
    .success(function(data) {
        var organizations = groupResponseByOrganization(data);
        for (key in organizations) {
            for (ds in organizations[key]) {
                organizations[key][ds].checked = false;
            }
        }
 
        $scope.organizations = organizations;
    })
    .error(function(error) {
        console.log('Failed: ' + error);
        $scope.error = error;
        console.log($scope.error);
    });
 
 
    $scope.chromosomes = ["1","2","3","4","5","6","7","8","9","10","11","12","13",
                          "14","15","16","17","18","19","20","21","22","X","Y","MT"];
 
    // Search parameters:
    $scope.chr = "1";
    $scope.allele = "A";
    $scope.ref = "hg18";
    $scope.pos = 0;
 
    $scope.selectAll = function(selected) {
        for (var key in $scope.organizations) {
            var org = $scope.organizations[key];
            for (var key2 in org) {
                var dataset = org[key2];
                dataset.checked = selected;
            }
        }
    }
 
    $scope.code = function() {
        var organizations = $scope.organizations;
        var ids = [];
 
        for (var key in organizations) {
            var organization = organizations[key];
            for (var beaconIndex in organization) {
                var beacon = organization[beaconIndex];
                if (beacon.checked) {
                    ids.push("\"" + beacon.id + "\"");
                }
            }
        }
 
        return "<script src=\"http://dnastack.com/ga4gh/bob/js/bobby.js\"></script>\n" +
        "<script>(\n" +
        "    function() {\n" +
        "        var beacons = [" + ids + "];\n" +
        "        var chromosome = " + $scope.chr + ";\n" +
        "        var allele = \"" + $scope.allele + "\";\n" +
        "        var position = " + $scope.pos + ";\n" +
        "        var genome = \"" + $scope.ref + "\";\n\n" +
        "        writeIFrame(chromosome, position, allele, genome, beacons);\n" +
        "    })();\n" +
        "</script>";
    }
 
}]);
