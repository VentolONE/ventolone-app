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
  return $resource(basePath+'/turbine/:id',{},{
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
});