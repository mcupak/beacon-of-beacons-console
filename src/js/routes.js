'use strict';

/**
 * Route configuration for the RDash module.
 */
angular.module('RDash').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        // The default pages for unmatched routes.
        $urlRouterProvider.when('/admins', '/admins/welcome');
        $urlRouterProvider.when('/beacons', '/beacons/search');
        $urlRouterProvider.when('/developers', '/developers/api/beacon');
        $urlRouterProvider.otherwise('/beacons/search');
        
        // Titles for pages (shown brwoser windows)
        var searchTitle         = "Search";
        var developersTitle     = "Developers";
        var beaconsTitle        = "GA4GH Beacon Network";
        var securityTitle       = "Security";
        var ethicsTitle         = "Privacy & Ethics";
        var termsTitle          = "Terms of Use";
        var adminConsoleTitle   = "Admin Control Center";

        // Application routes
        $stateProvider
            .state('admins', {
                abstract: true,
                url: '/admins',
                templateUrl: 'templates/admins/admins.html'
            })
            .state('admins.home', {
                url: '/welcome',
                templateUrl: 'templates/admins/admins_home.html',
                pageTitle : beaconsTitle
            })
            .state('admins.control', {
                url: '/control',
                templateUrl: 'templates/admins/admins_control.html',
                pageTitle : beaconsTitle
            })
            .state('admins.performance', {
                url: '/performance',
                templateUrl: 'templates/admins/admins_performance.html',
                pageTitle : beaconsTitle
            })
            .state('admins.genome', {
                url: '/genome',
                templateUrl: 'templates/admins/admins_genome.html',
                pageTitle : beaconsTitle
            })

            .state('beacons', {
                abstract: true,
                url: '/beacons',
                templateUrl: 'templates/beacons/beacons.html'
            })
            .state('beacons.search', {
                url: '/search',
                templateUrl: 'templates/beacons/beacons_search.html',
                pageTitle : beaconsTitle
            })
            .state('beacons.directory', {
                url: '/directory',
                templateUrl: 'templates/beacons/beacons_directory.html',
                pageTitle : beaconsTitle
            })
            .state('beacons.map', {
                url: '/map',
                templateUrl: 'templates/beacons/beacons_map.html',
                pageTitle : beaconsTitle
            })

            .state('developers', {
                abstract: true,
                url: '/developers',
                templateUrl: 'templates/developers/developers.html'
            })
            .state('developers.how', {
                url: '/how',
                templateUrl: 'templates/developers/developers_how.html',
                pageTitle : developersTitle
            })
            .state('developers.api_beacon', {
                url: '/api/beacon',
                templateUrl: 'templates/developers/developers_api_beacon.html',
                pageTitle : developersTitle
            })
            .state('developers.api_beacon_network', {
                url: '/api/beacon-network',
                templateUrl: 'templates/developers/developers_api_beacon_network.html',
                pageTitle : developersTitle
            })
            .state('developers.embed', {
                url: '/embed',
                templateUrl: 'templates/developers/developers_embed.html',
                pageTitle : developersTitle
            })
            .state('developers.faq', {
                url: '/faq',
                templateUrl: 'templates/developers/developers_faq.html',
                pageTitle : developersTitle
            })
<<<<<<< HEAD
            .state('terms', {
                url: '/terms',
                templateUrl: 'templates/terms.html',
                pageTitle : termsTitle
            })
=======

>>>>>>> Added links to new admin-related pages
            .state('ethics', {
                url: '/privacy_and_ethics',
                templateUrl: 'templates/ethics.html',
                pageTitle : ethicsTitle
            })
            .state('security', {
                url: '/security',
                templateUrl: 'templates/security.html',
                pageTitle : securityTitle
            });


    }
]).directive('updateTitle', ['$rootScope', '$timeout',
    function($rootScope, $timeout) {
        return {
            link: function(scope, element) {

                var listener = function(event, toState) {

                    var title = 'GA4GH Beacon Network';
                    /*if (toState.pageTitle) {
                        title = title + " | " + toState.pageTitle;
                    }*/


                    $timeout(function() {
                        element.text(title);
                    }, 0, false);
                };

                $rootScope.$on('$stateChangeSuccess', listener);
            }
        };
    }
]).directive('updatePageName', ['$rootScope', '$timeout',
    function($rootScope, $timeout) {
        return {
            link: function(scope, element) {

                var listener = function(event, toState) {

                    var name = '';
                    if (toState.pageTitle) {
                        name = toState.pageTitle;
                    }
                    else if (toState.parent && toState.parent.pageTitle) {
                        name = toState.parent.pageTitle;
                    }

                    $timeout(function() {
                        element.text(name);
                    }, 0, false);
                };
                $rootScope.$on('$stateChangeSuccess', listener);
            }
        };
    }
])
.directive('updateCrumbs', ['$rootScope', '$timeout',
    function($rootScope, $timeout) {
        return {
            link: function(scope, element) {

                var listener = function(event, toState) {

                    var title = "";
                    if (toState.url != "/") {
                        if (toState.crumbs) {
                            var num = toState.crumbs.length;
                            for (var i = 0; i < num; i++) {
                                var url = toState.crumbs[i].url;
                                var name = toState.crumbs[i].name;
                                if (i > 0) {
                                    title += " / ";
                                }
                                title += "<a href='" + url + "'>" + name + "</a>";
                            }
                        }
                    }

                    $timeout(function() {
                        element.html(title);
                    }, 0, false);
                };

                $rootScope.$on('$stateChangeSuccess', listener);
            }
        };
    }
]);