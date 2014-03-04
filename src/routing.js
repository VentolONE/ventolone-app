angular.module('Ventolone.routing', [
  'ngRouting',
  'Ventolone.resources.services'
])
  .config(function(routingProvider) {
    var resolve = {
      anemometer: function(anemometerById, $route, $rootScope, $location, $q) {
        var anemometerId = $route.current.pathParams.anemometerId
        return $q.when(anemometerDeferred = anemometerById(anemometerId)).then(function(anemometer) {
          $rootScope.anemometer = anemometer
          return anemometer
        }, function() {
          $rootScope.anemometer = null
          $location.path($rootScope.h.anemometersRoute())
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
