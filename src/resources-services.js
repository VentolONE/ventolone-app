(function(module) {

  module
    .factory('anemometerById', function(Anemometer, $q) {
      return function anemometerById(anemometerId) {
        if (!anemometerId) return null

        return Anemometer.get({
          id: anemometerId
        }).$promise
      };
    })
    .factory('anemometerStatistics', function(Sample, timeFilter) {
      return function anemometerStatistics(anemometerId, params, cb) {
        var dataFrequency = params.dataFrequency,
          group_level = (dataFrequency - 1) * 2 + 1

        return Sample.statistics({
          startkey: key(anemometerId, dataFrequency, params.from),
          endkey: key(anemometerId, dataFrequency, params.to, true)
        }, cb)
      };
    })
    .factory('samples', function(Sample, timeFilter) {
      return function samples(anemometer, timeSpan, dataFrequency) {
        return Sample.time({
          group_level: dataFrequency,
          startkey: key(anemometer._id, dataFrequency, timeFilter.from),
          endkey: key(anemometer._id, dataFrequency, timeFilter.to, true)
        }).$promise
      };
    })
    .constant('timeFilter', timeFilter)
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

  function key(anemometerId, dataFrequency, date, endKey) {
    var keyList = [anemometerId].concat(timeFilter(dataFrequency, date))
    if (endKey) {
      keyList.push({})
    }
    return JSON.stringify(keyList)
  }

  function timeFilter(dataFrequency, date) {
    if (date) {
      var d = new Date(date),
        filter = [d.getUTCFullYear() * 100 + d.getMonth()]

      for (var i = 1; i < dataFrequency - 1; i++) {
        filter.push(new Date(date))
      }
      return filter
    }
    return []
  }
}(angular.module('Ventolone.resources.services', [
  'Ventolone.resources'
])))
