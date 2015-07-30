/* 
    A date range directive
    that wraps around two popup Angular UI Bootstrap datepickers
    to allow selection of two different dates. 
    Usage example: <daterange startdate="date1" enddate="date2"></daterange> 
*/ 
var app = angular.module('RDash'); 
app.directive('daterange', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            startdate: '=',
            enddate: "="
        },
        template: 
            '<div class="date-range-selector">' + 
            '<div class="date-start col-lg-6">' +
                '<div>Start Date: </div>' + 
                '<div class="input-group">' +
                  '<input ng-model="startdate" type="text" class="form-control" datepicker-popup="yyyy-MM-dd" is-open="opened" datepicker-options="dateOptions" ng-required="true" close-text="Close">' +
                  '<span class="input-group-btn">' +
                    '<button type="button" class="buttonstart btn btn-default"><i class="glyphicon glyphicon-calendar"></i></button>' +
                  '</span>' +
                '</div>' + 
            '</div>' + 
            '<div class="date-end col-lg-6">' +
                '<div>End Date: </div>' + 
                '<div class="input-group">' +
                  '<input ng-model="enddate" type="text" class="form-control" datepicker-popup="yyyy-MM-dd" is-open="opened2" datepicker-options="dateOptions" ng-required="true" close-text="Close">' +
                  '<span class="input-group-btn">' +
                    '<button type="button" class="buttonend btn btn-default"><i class="glyphicon glyphicon-calendar"></i></button>' +
                  '</span>' +
                '</div>' + 
            '</div>' + 
            '</div>',
            
        controller: function ($scope) {
            $scope.opened = false;
            $scope.opened2 = false;
        },
        link: function (scope, element) {
            scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };
            element.find('.buttonstart').bind('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                scope.opened = true;
                scope.$apply();
            });
            element.find('.buttonend').bind('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                scope.opened2 = true;
                scope.$apply();
            });
        }
    };
});


