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
  .factory('anemometerStatistics', function(Sample, timeFilter) {
    return function anemometerStatistics(anemometerId, params, cb) {
      var dataFrequency = params.dataFrequency,
        group_level = (dataFrequency - 1) * 2 + 1

      return Sample.statistics({
        startkey: JSON.stringify([anemometerId].concat(timeFilter(dataFrequency, params.from))),
        endkey: JSON.stringify([anemometerId].concat(timeFilter(dataFrequency, params.to)).concat({}))
      }, cb)
    };
  })
  .constant('timeFilter', function timeFilter(dataFrequency, date) {
    if (date) {
      var d = new Date(date),
        filter = [d.getUTCFullYear() * 100 + d.getMonth()]

      for (var i = 1; i < dataFrequency - 1; i++) {
        filter.push(new Date(date))
      }
      return filter
    }
    return []
  })
  .constant('frequencyTimeFilter', function frequencyTimeFilter(dataFrequency, date, val) {
    if (date) {
      var d = new Date(date),
        filter = [new Date(d.getUTCFullYear(), d.getMonth(), 1), val]

      for (var i = 1; i < dataFrequency - 1; i++) {
        filter.push(new Date(date))
        filter.push(val)
      }
      return filter
    }
    return []
  })
