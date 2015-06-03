/**
 * Beacon On/Off Switch Controller
 */

angular.module('RDash').controller('BeaconSwitchCtrl', ['$scope', '$q', '$http', function($scope, $q, $http) {

    $scope.error = undefined;

    /*
        Get a list of beacons organized by orgzanization
        using the function getBeaconList() in beacon.network.js
    */
    getBeaconsList($q, $http).then(function(data) {
        $scope.organizations = data;
    }, function(error) {
        console.log('Failed: ' + error);
        $scope.error = error;
        console.log($scope.error);
    }, function(update) {
        console.log('Got notification: ' + update);
    });

    /*
        Change host status given hosted beacon's status 
    */
    $scope.updateHostStatus = function(beaconID, beaconStatus){
        //Get organization ID 
        var hostName = document.getElementById(beaconID).className;
        console.log(hostName);
        var host = document.getElementById(hostName);
        //Update host checked status if necessary 
        if(beaconStatus){
            host.checked = true;
            return;
        } else {
            var beacons = $scope.organizations[hostName];
            for(i in beacons){
                if (document.getElementById(beacons[i].id).checked == true){
                    host.checked = true;
                    return;
                }
            }
            host.checked = false;
        }
    }

    /*
        Given a beaconID, enable the beacon or disable the beacon
        if enable == true or fals, respectively. 
    */
    $scope.changeBeaconStatus = function(beaconID, enable){
        if (enable){
            console.log("Enabling " +  beaconID + ".");
            //TODO : actutal implementation 
        } else {
            console.log("Disabling " +  beaconID + ".");
            //TODO : actutal implementation 
        }
    }

    /*
        Given host ID, change statuses of related beacons accordingly
    */
    $scope.changeBeaconStatusByHost = function(hostName, enable){
        //Get a list of beacons hosted by the host 
        var beacons = $scope.organizations[hostName];
        
        // change all beacons status accordingly 
        for (i in beacons){
            var beaconID = beacons[i]["id"];
            document.getElementById(beaconID).checked = enable;
            $scope.changeBeaconStatus(beaconID, enable);
        };  
    }

    /*
        Enable or disable beacons by checking on/off organization
    */
    $scope.checkBeaconsByOrg = function(event){
        var checked = event.target.checked;
        var hostID = event.target.id;
        $scope.changeBeaconStatusByHost(hostID, checked);
    };


    /*
        Disable or enable individual beacon 
    */
    $scope.checkOrg = function(event){
        var beaconID = event.target.id;
        var checked = event.target.checked;
        $scope.changeBeaconStatus(beaconID, checked);
        $scope.updateHostStatus(beaconID, checked);
    };

    /*
        Switch on/off all beacons and hosts 
    */
    $scope.switchAll = function(event){
        var enable = event.target.checked;
        //Go through each organization and change all beacon status 
        for (host in $scope.organizations){
            $scope.changeBeaconStatusByHost(host, enable);
            document.getElementById(host).checked = enable;
        }
    }

    /*
        Update the state of the master switch
        TODO: proper handle initializing event 
    */
    $scope.getMasterState = function(){
        for (host in $scope.organizations){
            if(document.getElementById(host) == null){
                return false;
            } else if (document.getElementById(host).checked){
                    return true;
            }
        } return false;
        
    }


}]);

