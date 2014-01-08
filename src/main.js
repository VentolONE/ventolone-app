angular.module('Ventolone', ['ngRoute'])
  .config(function($routeProvider) {
    $routeProvider
      .when('/config',{
        templateUrl: 'views/config-form.html',
        controller: 'ConfigController'
      })
      .when('/dashboard',{
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardController'
      })
      .when('/upload',{
        templateUrl: 'views/form-upload.html',
        controller: 'UploadController'
      })
  })
.controller('ConfigController',function ($scope) {
  $scope.submit = function  () {
    console.log($scope.turbine)
  }
})
.controller('DashboardController',angular.noop)
.controller('UploadController',angular.noop)
