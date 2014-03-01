angular.module('Ventolone', [
  'ngRoute'
  ,'ngRouting'
  ,'Ventolone.charts'
  ,'Ventolone.resources'
  ,'Ventolone.controllers'
])
  .config(function(routingProvider) {
    var resolve = {
      anemometer: function(Anemometer, $route, $routeParams, $rootScope) {
        return $route.current.pathParams.anemometerId && Anemometer.get({
          id: $route.current.pathParams.anemometerId
        }, function (anemometer) {
          $rootScope.anemometer = anemometer
        }).$promise
      }
    }

    routingProvider
      .withResolve(resolve)
      .build([{
        model: 'anemometer'
        , actions:['upload']
      }])
      .when('/', {
        redirectTo: '/anemometers'
      })
  })
  .run(function($rootScope, routing) {
    $rootScope.h = routing.helpers
    $rootScope.$on('$locationChangeStart',function () {
      $rootScope.anemometer = null
    })
  })
  