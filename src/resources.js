angular.module('Ventolone.resources', ['ngResource'])
.constant('basePath', 'http://localhost:5984/')
// .constant('basePath', 'http://lit.iriscouch.com/')
.constant('getRows',function getRows(data) {
  return JSON.parse(data).rows
})
.factory('ventolone', function($resource, basePath, getRows) {
  return $resource(basePath+'ventolone/_design/charts/_view/:type', {
    group: true,
    descending: false
  }, {
    time: {
      method: 'get',
      transformResponse: getRows,
      isArray: true,
      params: {
        type:'time'
      }
    },
    frequency: {
      method: 'get',
      transformResponse: getRows,
      isArray: true,
      params: {
        type:'frequency'
      }
    },
    stats: {
      method: 'get',
      transformResponse: function (data) {
        return JSON.parse(data).rows[0].value
      },
      params:{
        type: 'stats'
      }
    }
  })
})
.factory('Turbine', function($resource, basePath, getRows) {
  return $resource(basePath+'turbine/:id',{},{
    query:{
      isArray:true,
      method:'get',
      params:{
        id:'_all_docs',
        include_docs:true
      },
      transformResponse: function(data){
        return getRows(data).map(function (item) {
          return item.doc
        })
      }
    }
  });
})
.factory('upload', function ($http, $q, basePath) {
  var numberOfDocs = 10000
  return function (turbine, iterator) {
    var numberOfUploads = Math.ceil(iterator.size() / numberOfDocs)
        ,promises = []
        ,deferred = $q.defer()

    for (var i = 0; i < numberOfUploads; i++) {
      (function(batch){
        var slice = iterator.slice(i*numberOfDocs,(i+1)*numberOfDocs)
            , promise = $http.post(basePath+'prova/_bulk_docs', {
              docs: slice.map(function (item) {
                return {
                  turbineId: turbine._id
                  , time:    parseFloat(item[0])
                  , deltaT:  parseFloat(item[1])
                  , p:       parseFloat(item[2])
                  , battery: parseFloat(item[3])
                  , speed:   parseFloat(item[2])/parseFloat(item[1]) * 1.1176
                }
              })
            }).success(function () {
              deferred.notify(batch)
            })

          promises.push(promise)
        }(i))

    };

    $q.all(promises).then(function (res) {
      deferred.resolve(res)
    })

    return {
      promise: deferred.promise,
      numberOfUploads: numberOfUploads
    }
  }
})