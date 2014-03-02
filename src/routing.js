angular.module('Ventolone.routing', [
  'ngRouting',
  'Ventolone.resources.services'
])
  .config(function(routingProvider) {
    var resolve = {
      anemometer: function(anemometerById, $route, $rootScope) {
        return anemometerById($route.current.pathParams.anemometerId, function(anemometer) {
          $rootScope.anemometer = anemometer
        })
      }
    }

    routingProvider
      .withResolve(resolve)
      .build([{
        model: 'anemometer',
        actions: ['upload']
      }])
      .when('/', {
        redirectTo: '/anemometers'
      })
  })
  .run(function($rootScope, routing) {
    $rootScope.h = routing.helpers
    $rootScope.$on('$locationChangeStart', function() {
      $rootScope.anemometer = null
    })
  })
