  'use strict';

/**
 * @ngdoc overview
 * @name mapApp
 * @description
 * # mapApp
 *
 * Main module of the application.
 */
var mapApp = angular.module('mapApp', [
    'mapControllers',
    'directives',
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.map'
      ]);
  mapApp.config(function ($routeProvider) {
    $routeProvider
       .when('/', {
        templateUrl: 'views/map-list.html',
        controller: 'ListController'
      })
      .otherwise({
        redirectTo: 'views/main.html'
      });
  });
 
