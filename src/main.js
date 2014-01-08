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
        templateUrl: 'views/upload.html',
        controller: 'UploadController'
      })
  })
.controller('ConfigController',angular.noop)
.controller('DashboardController',angular.noop)
.controller('UploadController',angular.noop)
