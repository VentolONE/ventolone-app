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

.directive('formGroup',function () {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'partials/form-group.html',
    replace:true,
    scope: {
      help: '@',
      label: '@',
      required: '=',
      placeholder:'@'
    },
    link: function (scope, element, attrs1) {
      element.find('input')
        .addClass('form-control')
        .attr('placeholder', scope.placeholder || 'Enter text')
        .attr('ng-required', scope.required)
    }
  }
})