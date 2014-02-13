angular.module('Ventolone.resources', ['ngResource'])
.constant('resourcesConf',{
  // basePath: 'http://localhost:5984/',
  basePath: 'http://ventolone-litapp.rhcloud.com/',
  numberOfDocs: 10000
})
.constant('getRows',function getRows(data) {
  return JSON.parse(data).rows
})
.factory('ventolone', function($resource, resourcesConf, getRows) {
  return $resource(resourcesConf.basePath+'ventolone/_design/charts/_view/:type', {
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
.factory('Turbine', function($resource, resourcesConf, getRows) {
  return $resource(resourcesConf.basePath+'turbine/:id',{},{
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
.factory('upload', function ($http, $q, resourcesConf) {
  var numberOfDocs = resourcesConf.numberOfDocs
  return function (turbine, iterator) {
    var numberOfUploads = Math.ceil(iterator.size() / numberOfDocs)
        ,promises = []
        ,deferred = $q.defer()

    for (var i = 0; i < numberOfUploads; i++) {
      (function(batch){
        var slice = iterator.slice(i*numberOfDocs,(i+1)*numberOfDocs)
            , promise = $http.post(resourcesConf.basePath+'ventolone/_bulk_docs', {
              docs: slice.map(function (item) {
                if(item[0]){
                  return {
                    _id:         turbine._id+'_'+item[0]
                    , turbineId: turbine._id
                    , time:      item[0]
                    , deltaT:    item[1]
                    , p:         item[2]
                    , battery:   item[3]
                    , speed:     item[2]/item[1] * 1.1176
                  }
                }
              }).filter(angular.identity)
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