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
        , actions:['upload']
      }])
      .when('/', {
        redirectTo: '/anemometers'
      })
  })
  .run(function($rootScope, routing) {
    $rootScope.h = routing.helpers
  })
  