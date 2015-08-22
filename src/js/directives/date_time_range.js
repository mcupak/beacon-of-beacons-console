/* 
    A date and time range directive
    that wraps around two popup Angular UI Bootstrap datepickers and two time pickers
    to allow selection of two different dates. 
    Usage example:  <date-time-range startdate="date1" enddate="date2" maxdate="today" format="format"></date-time-range>

    `mindate` and `maxdate` are optional and they take in a Date object. For example, 
    `maxdate` could be set it to today's day by etting the attribute to "today" and 
    declaring ' $scope.today = new Date(); ' 
    in the view's controller

    Format is also optional and can be any of the follow: 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'
*/ 
var app = angular.module('RDash'); 
app.directive('dateTimeRange', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            format : "=format",
            startdate: "=startdate",
            enddate: "=enddate", 
            mindate: "=mindate",
            maxdate: "=maxdate"
        },
        template: 
            '<div class="date-range-selector">' + 
                '<div class="date-start col-lg-6 col-md-12 ">' +
                    '<div class="col-lg-9 col-md-8 col-sm-12 date-element date-pick" >' +
                        '<div class="guide-text">From </div>' + 
                        '<div class="input-group">' +
                          '<input ng-model="startdate" type="text" class="form-control" datepicker-popup={{format}} is-open="opened" min-date="mindate" max-date="maxdate" datepicker-options="dateOptions" ng-required="true" >' +
                          '<span class="input-group-btn">' +
                            '<button ng-click="openStartCalendar($event)" type="button" class="buttonstart btn btn-default"><i class="glyphicon glyphicon-calendar"></i></button>' +
                          '</span>' +
                        '</div>' +
                    '</div>' + 
                    '<div class="col-lg-3 col-md-4 col-sm-12 date-element time-pick">' +
                        '<timepicker ng-model="startdate" hour-step="1" minute-step="10" show-meridian="ismeridian"></timepicker>' + 
                    '</div>' + 
                '</div>' + 
                '<div class="date-end col-lg-6 col-md-12">' +
                    '<div class="col-lg-9 col-md-8 col-sm-12 date-element date-pick" >' +
                        '<div class="guide-text">To </div>' + 
                        '<div class="input-group">' +
                          '<input ng-model="enddate"  type="text" class="form-control" datepicker-popup={{format}} is-open="opened2" min-date="minEndDate" max-date="maxdate" datepicker-options="dateOptions" ng-required="true" >' +
                          '<span class="input-group-btn">' +
                            '<button ng-click="openEndCalendar($event)" type="button" class="buttonend btn btn-default"><i class="glyphicon glyphicon-calendar"></i></button>' +
                          '</span>' +
                        '</div>' + 
                    '</div>' + 
                    '<div class="col-lg-3 col-md-4 col-sm-12 date-element time-pick" >' +
                        '<timepicker ng-model="enddate" hour-step="1" minute-step="10" show-meridian="ismeridian"></timepicker>' + 
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
                startingDay: 1
            };

            // Open the first calendar for start date 
            scope.openStartCalendar = function($event){
                scope.opened = true;
            };

            // Open the second calendar for end date 
            scope.openEndCalendar = function($event){
                scope.opened2 = true;
            };

            // Basic input control
            scope.$watch('startdate', function(newDate, oldDate, scope) {
                if(newDate){
                    // Limit min date on the end date. 
                    scope.minEndDate = scope.startdate;
                    if(scope.enddate <= scope.startdate){
                        // User needs to reselect a new end date
                        scope.enddate = null; 
                    }
                }
            }, true);

            scope.$watch('enddate', function(newDate, oldDate, scope) {
                if(newDate){
                    if(scope.enddate <= scope.startdate){
                        // User needs to reselect a new start date
                        scope.startdate = null; 
                    }
                }
            }, true);

        }
    };
});


