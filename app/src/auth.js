angular.module('Ventolone.auth', [
  'Ventolone.configuration',
  'ngRoute'
])
  .config(function($routeProvider, configuration) {
    $routeProvider.when('/login', {
      templateUrl: configuration.static_path + 'views/auth/login.html',
      controller: 'LoginController'
    })
  })
  .controller('LoginController', function($scope, security, $location) {
    $scope.submit = function() {
      security
        .authenticate($scope.login)
        .then(function(request) {
          security.user = request.data
          $location.path('/anemometers')
        }, function(request) {
          security.user = null
          $scope.loginError = request.data.error
        })
    }
  })
  .factory('security', function($http, configuration) {
    var security = {
      authenticate: function(login) {
        return $http({
          method: 'post',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          url: configuration.resources.dbUrl + '/_session',
          withCredentials: true,
          data: login,
          transformRequest: function(data) {
            return Object.keys(data).map(function(key) {
              return [encodeURIComponent(key), encodeURIComponent(data[key])].join('=')
            }).join('&')
          },
          transformResponse: function(data, headers) {
            console.log(headers())
            return JSON.parse(data)
          }
        })
      }
    }
    return security
  })
