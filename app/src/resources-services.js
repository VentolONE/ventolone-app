(function(module) {

  module
    .factory('anemometerService', function(Anemometer, Sample, $q) {
      return {
        findById: function findById(id) {
          if (!id) {
            var deferred = $q.defer()
            deferred.reject()
            return deferred.promise
          }

          return Anemometer.get({
            id: id
          }).$promise
        },
        statistics: function statistics(id, params) {
          var dataFrequency = params.dataFrequency,
            group_level = (dataFrequency - 1) * 2 + 1

          return Sample.statistics({
            startkey: key(id, dataFrequency, params.from),
            endkey: key(id, dataFrequency, params.to, true)
          }).$promise
        },
        samples: function samples(id, params) {
          var timeSpan = params.timeSpan || {},
            dataFrequency = params.dataFrequency;

          if (timeSpan.to < timeSpan.from) {
            var deferred = $q.defer()
            deferred.reject()
            return deferred.promise
          }
          return Sample.time({
            group_level: dataFrequency,
            startkey: key(id, dataFrequency, timeSpan.from),
            endkey: key(id, dataFrequency, timeSpan.to, true)
          }).$promise
        }
      }
    })
    .constant('timeFilter', timeFilter)
    .constant('frequencyTimeFilter', frequencyTimeFilter)

  function frequencyTimeFilter(dataFrequency, date, val) {
    if (date && dataFrequency > 1) {
      var d = new Date(date),
        filter = [date.getUTCFullYear() * 100 + date.getMonth(), val]

      for (var i = 1; i < dataFrequency - 1; i++) {
        filter.push(new Date(date))
        filter.push(val)
      }
      return filter
    }
    return []
  }

  function key(anemometerId, dataFrequency, date, endKey) {
    var keyList = [anemometerId].concat(timeFilter(dataFrequency, date))
    if (endKey) {
      keyList.push({})
    }
    return JSON.stringify(keyList)
  }

  function timeFilter(dataFrequency, date) {
    if (date && dataFrequency > 1) {
      var filter = [date.getUTCFullYear() * 100 + date.getMonth()]
      for (var i = 1; i < dataFrequency - 1; i++) {
        filter.push(date)
      }
      return filter
    }
    return []
  }
}(angular.module('Ventolone.resources.services', [
  'Ventolone.resources'
])))
