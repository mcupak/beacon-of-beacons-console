/**
 * Beacon performance display controller 
 */

angular.module('RDash').controller('performanceCtrl', ['$scope', '$timeout', '$q', '$http', 
    function($scope, $timeout, $q, $http) {

   
    $scope.colors = ["green", "red", "orange"];
    //$scope.data = [5, 10, 20];
    $scope.name = "bob";
    $scope.nquery = 1234;
    console.log($scope.data);

    $timeout(function() {
        $('#progress').remove();
        $scope.data = [5, 10, 30];
         console.log($scope.data);
    }, 2000)


}]);

