(function(resourceModule) {
  var resourcesConf

  resourceModule
    .config(function(configuration){
      resourcesConf = configuration.resources
    })
    .factory('Sample', function($resource) {
      return $resource(resourcesConf.basePath + 'sample/_design/charts/_view/:viewName', {
        group: true,
        descending: false
      }, {
        time: makeView('time'),
        frequency: makeView('frequency'),
        stats: makeStatsView('stats'),
        dates: makeStatsView('dates'),
        statistics: makeStatsView('statistics', {
          group_level: 1
        }),
      })
    })
    .factory('Anemometer', function($resource) {
      return $resource(resourcesConf.basePath + 'anemometer/:id', {}, {
        query: {
          isArray: true,
          method: 'GET',
          params: {
            id: '_all_docs',
            include_docs: true
          },
          transformResponse: function(data) {
            return getRows(data).map(function(item) {
              return item.doc
            })
          }
        }
      })
    })
    .factory('upload', function($http, $q) {
      var numberOfDocs = resourcesConf.numberOfDocs
      return function(anemometer, iterator) {
        var numberOfUploads = Math.ceil(iterator.size() / numberOfDocs),
          promises = [],
          deferred = $q.defer()

          for (var i = 0; i < numberOfUploads; i++) {
            (function(batch) {
              var slice = iterator.slice(i * numberOfDocs, (i + 1) * numberOfDocs),
                promise = $http.post(resourcesConf.basePath + 'sample/_bulk_docs', {
                  docs: slice.map(function(item) {
                    if (item.length == 4 && item.reduce(function(acc, value) {
                      return acc && value != null && value != "" && angular.isNumber(parseFloat(value))
                    }, true)) {
                      return {
                        _id: anemometer._id + '_' + item[0],
                        a: anemometer._id,
                        t: item[0],
                        d: item[1],
                        p: item[2],
                        b: item[3],
                        s: item[2] / item[1] * 1.1176
                      }
                    }
                  }).filter(angular.identity)
                }).success(function() {
                  deferred.notify(batch)
                })

                promises.push(promise)
            }(i))

          };

        $q.all(promises).then(function(res) {
          deferred.resolve(res)
        })

        return {
          promise: deferred.promise,
          numberOfUploads: numberOfUploads
        }
      }
    })
    .factory('params', function($http, resourcesConf) {
      return $http({
        method: 'get',
        url: resourcesConf.basePath + 'sample/_design/charts',
        transformResponse: function(data) {
          var exports = {}
          eval(JSON.parse(data).views.lib.params)
          return exports
        }
      }).then(function(response) {
        return response.data
      })
    })

  function getRows(data) {
    return JSON.parse(data).rows
  }

  function makeView(viewName, isArray, transformResponse, params) {
    return {
      method: 'GET',
      transformResponse: transformResponse || getRows,
      isArray: isArray == null ? true : isArray,
      params: angular.extend({
        viewName: viewName,
        stale: 'update_after'
      }, params)
    }
  }

  function makeStatsView(viewName, params) {
    return makeView(viewName, false, function(data) {
      return (getRows(data)[0] || {}).value
    }, params || {})
  }
})(angular.module('Ventolone.resources', [
  'ngResource',
  'Ventolone.configuration'
]))
