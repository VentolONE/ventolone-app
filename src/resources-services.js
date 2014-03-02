angular.module('Ventolone.resources.services', [
  'Ventolone.resources'
])
  .factory('anemometerById', function(Anemometer) {
    return function anemometerById(anemometerId, cb) {
      return anemometerId ? Anemometer.get({
        id: anemometerId
      }, cb).$promise : null
    };
  })
  .factory('anemometerStatistics', function(Sample) {
    return function name(anemometerId, params, cb) {
      return Sample.statistics({
        startkey: JSON.stringify([anemometerId]),
        endkey: JSON.stringify([anemometerId, {}])
      }, params || {}, cb)
    };
  })
