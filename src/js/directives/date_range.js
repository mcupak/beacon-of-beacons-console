/* 
    A date range directive
    that wraps around two popup Angular UI Bootstrap datepickers
    to allow selection of two different dates. 
    Usage example: <daterange startdate="date1" enddate="date2" mindate="lastFriday" maxdate="today"></daterange>

    `mindate` and `maxdate` are optional and they take in a Date object. For example, 
    `maxdate` could be set it to today's day by etting the attribute to "today" and 
    declaring ' $scope.today = new Date(); ' 
    in the view's controller
*/ 
var app = angular.module('RDash'); 
app.directive('daterange', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            startdate: '=startdate',
            enddate: "=enddate", 
            mindate: "=mindate",
            maxdate: "=maxdate"
        },
        template: 
            '<div class="date-range-selector">' + 
            '<div class="date-start col-lg-6">' +
                '<div style="float:left; padding:5px; font-size:20px;">From </div>' + 
                '<div class="input-group">' +
                  '<input ng-model="startdate" type="text" class="form-control" datepicker-popup="yyyy-MM-dd" is-open="opened" min-date="mindate" max-date="maxdate" datepicker-options="dateOptions" ng-required="true" close-text="Close">' +
                  '<span class="input-group-btn">' +
                    '<button ng-click="openStartCalendar($event)" type="button" class="buttonstart btn btn-default"><i class="glyphicon glyphicon-calendar"></i></button>' +
                  '</span>' +
                '</div>' + 
            '</div>' + 
            '<div class="date-end col-lg-6">' +
                '<div style="float:left; padding:5px; font-size:20px;">To </div>' + 
                '<div class="input-group">' +
                  '<input ng-model="enddate" type="text" class="form-control" datepicker-popup="yyyy-MM-dd" is-open="opened2" min-date="minEndDate" max-date="maxdate" datepicker-options="dateOptions" ng-required="true" close-text="Close">' +
                  '<span class="input-group-btn">' +
                    '<button ng-click="openEndCalendar($event)" type="button" class="buttonend btn btn-default"><i class="glyphicon glyphicon-calendar"></i></button>' +
                  '</span>' +
                '</div>' + 
            '</div>' + 
            '</div>',
            
        controller: function ($scope, $element, $attrs) {
            $scope.opened = false;
            $scope.opened2 = false;
            $scope.minEndDate = $scope.mindate; 
        },
        link: function (scope, element, attrs) {
            scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };

            // Open the first calendar for start date 
            scope.openStartCalendar = function($event){
                $event.preventDefault();
                $event.stopPropagation();
                scope.opened = true;
            };

            // Open the second calendar for end date 
            scope.openEndCalendar = function($event){
                $event.preventDefault();
                $event.stopPropagation();
                scope.opened2 = true;
            };

            // Basic input control: limit min date on the end date. 
            scope.$watch('startdate', function(newDate, oldDate, scope) {
                if(newDate){
                    scope.minEndDate = scope.startdate;
                    if(scope.enddate < scope.startdate){
                        // User needs to reselect a new end date
                        scope.enddate = null; 
                    }
                }
            }, true);
        }
    };
});


