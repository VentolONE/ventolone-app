angular.module('Ventolone', [
  'ngRoute'
  ,'ngRouting'
  ,'Ventolone.charts'
  ,'Ventolone.resources'
  ,'Ventolone.controllers'
])
  .config(function(routingProvider) {
    var resolve = {
      anemometer: function(Anemometer, $route, $routeParams) {
        return Anemometer.get({
          id: $route.current.pathParams.anemometerId
        }).$promise
      }
    }

    routingProvider
      .withResolve(resolve)
      .build([{
        model: 'anemometer'
      }])
      .when('/anemometers/:anemometerId/upload', {
        templateUrl: 'views/anemometer/upload.html',
        controller: 'UploadController',
        resolve: resolve
      })
      .when('/', {
        redirectTo: '/anemometers'
      })
  })
  .run(function($rootScope, routing) {
    $rootScope.h = routing.helpers
    $rootScope.h.anemometerUploadPath = function(anemometerId) {
      return $rootScope.h.anemometerPath(anemometerId) + '/upload'
    }
    $rootScope.h.anemometerUploadRoute = function(anemometerId) {
      return $rootScope.h.anemometerRoute(anemometerId) + '/upload'
    }
  })
  