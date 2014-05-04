angular.module('Ventolone.routing', [
  'ngRouting',
  'Ventolone.resources.services',
  'Ventolone.configuration'
])
  .config(function($locationProvider) {
    $locationProvider.html5Mode(true);
  })
  .config(function(routingProvider, configuration) {
    var resolve = {
      anemometer: function(anemometerService, $route, $rootScope, $location, $q) {
        var anemometerId = $route.current.pathParams.anemometerId
        
        if ("NewAnemometerCtrl" == $route.current.controller) return {}
        
        return anemometerService.findById(anemometerId).then(function(anemometer) {
          $rootScope.anemometer = anemometer
          return anemometer
        }, function() {
          $location.path($rootScope.h.anemometersRoute())
        })
      }
    }

    routingProvider.viewTemplate = configuration.static_path + routingProvider.viewTemplate,

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
