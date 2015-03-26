'use strict';
// Declare app level module which depends on views, and components
var streamingWeb = angular.module('streamingWeb', [
    'ngRoute',
    'streamingWeb.main',
    'streamingWeb.auth',
    'ngGrid',
    'ui.bootstrap',
    'ngStorage'
]);

streamingWeb.config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {
  $routeProvider.
      when('/', {
        templateUrl: 'main/main.html',
        controller: 'MainController',
          resolve: {
              factory: redirectIfNotLoggedIn
          }
      }).
      when('/auth', {
        templateUrl: 'authentication/auth.html',
        controller: 'AuthController',
          resolve: {
              factory: checkLoggedIn
          }
      }).
      when('/someOtherView/:newName', {
        templateUrl: 'someOtherView/view1.html',
        controller: 'CONTROLLER'
      }).
      otherwise({
        redirectTo: '/'
      });

    $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function($q, $location, $localStorage) {
        return {
            'request': function (config) {
                config.headers = config.headers || {};
                if ($localStorage.token) {
                    config.headers.Authorization = 'Bearer ' + $localStorage.token;
                }
                return config;
            },
            'responseError': function(response) {
                if(response.status === 401 || response.status === 403) {
                    $location.path('/auth');
                }
                return $q.reject(response);
            }
        };
    }]);
}]);

var checkLoggedIn= function ($q, $rootScope, $location, $localStorage) {
    if(typeof $localStorage.token === 'undefined'){
        return true;
    } else {
        var deferred = $q.defer();
        deferred.reject();
        $location.path("/app");
        //window.location = "/app";
        return deferred.promise;
    }
};


var redirectIfNotLoggedIn= function ($q, $rootScope, $location, $localStorage) {
    if(typeof $localStorage.token === 'undefined'){
        var deferred = $q.defer();
        deferred.reject();
        $location.path("/auth");
        //window.location = "/app";
        return deferred.promise;
    } else {
        return true;
    }
};
