'use strict';

var auth = angular.module('streamingWeb.auth', []);


auth.controller('AuthController', ['$scope', '$http', '$location', '$localStorage', '$rootScope', 'AuthService', '$window', function($scope, $http, $location, $localStorage, $rootScope, AuthService, $window){
    $scope.formInfo = {};
    $scope.token = $localStorage.token;
    $scope.authenticate = function(){
        var formData = {
            email: $scope.formInfo.login.email,
            password: $scope.formInfo.login.password
        }
        AuthService.authenticate(formData, function(res){
            if(res.type ==false){
                alert(res.data)
            }else{
                $localStorage.token = res.data.token;
                $localStorage.$save();
                $scope.token = $localStorage.token;
                //$location.path("/app#");
                $window.location = '/app#';
            }
        }, function(){
            $rootScope.error = "Failed to sign in";
        });
    }
    $scope.register = function(){
        var formData = {
            email: $scope.formInfo.login.email,
            password: $scope.formInfo.login.password
        }
        AuthService.save(formData, function(res){
            if(res.type ==false){
                alert(res.data)
            }else{
                $localStorage.token = res.data.token;
                $localStorage.$save();
                $scope.token = $localStorage.token;
                //$location.path("/app#");
                $window.location = '/app#';
            }
        }, function(){
            $rootScope.error = "Failed to register";
        });
    }
    $scope.logout = function(){
        AuthService.logout(function(){
            $scope.token = $localStorage.token;
            $location.path("/app#/auth");
    })};

}]);

auth.factory('AuthService', ['$http', '$localStorage', function($http, $localStorage){
    var baseUrl = 'http://localhost:3000';

    function changeUser(user) {
        angular.extend(currentUser, user);
    }

    function urlBase64Decode(str) {
        var output = str.replace('-', '+').replace('_', '/');
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                throw 'Illegal base64url string!';
        }
        return window.atob(output);
    }

    function getUserFromToken() {
        var token = $localStorage.token;
        var user = {};
        if (typeof token !== 'undefined') {
            var encoded = token.split('.')[1];
            user = JSON.parse(urlBase64Decode(encoded));
        }
        return user;
    }

    var currentUser = getUserFromToken();

    return {
        save: function(data, success, error) {
            $http.post(baseUrl + '/register', data).success(success).error(error)
        },
        authenticate: function(data, success, error) {
            $http.post(baseUrl + '/authenticate', data).success(success).error(error)
        },
        me: function(success, error) {
            $http.get(baseUrl + '/me').success(success).error(error)
        },
        logout: function(success) {
            changeUser({});
            delete $localStorage.token;
            $localStorage.$save();
            success();
        }
    };
}]);