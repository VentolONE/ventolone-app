angular.module('Ventolone', ['ngRoute','ngGoogleCharts','Ventolone.resources'])
  .config(function($routeProvider) {
    $routeProvider
      .when('/config/:id?',{
        templateUrl: 'views/config-form.html',
        controller: 'ConfigController'
      })
      .when('/dashboard/:id',{
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardController',
      })
      .when('/upload/:id',{
        templateUrl: 'views/form-upload.html',
        controller: 'UploadController'
      })
      .when('/dashboard', {
        redirectTo:'/config'
      })
  })
.controller('AppController', function($routeParams, $location){
  if(! $routeParams.id ) {
    $location.path('/config');
  }
})
.controller('ConfigController',function ($scope, turbine, $routeParams, $rootScope) {
  $scope.submit = function  () {
    turbine.save($scope.turbine)
  }

  if ($routeParams.id) {
    // id db di test '51bec2794c04c9c003f45e8ae30004f2'
    turbine.get({id: $routeParams.id},function(data){
      $rootScope.turbine = data;
    })
  }

})
.controller('DashboardController',
function ($scope , ventolone , chartReady , $q ) {

  $scope.options = {
      month: 2,
      day: 3,
      half_day: 4,
      hour: 5,
      half_hour:6,
      ten_minute: 7,
      minutes: 8
    }

    $scope.plants = [
      "MFEREKE",
      "BOOOHHHH"
    ]

    $scope.dataFrequency = 4
    $scope.plant = $scope.plants[1]

    // $scope.timeSpan = {
    //   from: '2014-01-01'
    //   , to: '2014-12-31'
    // }

    $scope.timeSpan = {
      from: '2013-08-15'
      , to: '2013-09-15'
    }


    var intervals =  [3600 * 24, 3600 * 6, 3600, 1800, 600, 60]

    function timeFilter(dataFrequency, date){
      if(date){
        var d = new Date(date)
            ,filter = [new Date(d.getUTCFullYear(), d.getMonth(), 1)]

        for(var i=1; i<dataFrequency-1; i++){
          filter.push(new Date(date))
        }
        return filter
      }
      return []
    }

    $scope.$watch('dataFrequency+plant+timeSpan.from+timeSpan.to', function() {
      var dataFrequency = $scope.dataFrequency
      if(dataFrequency && $scope.plant){
        $q.all({
          chartReady: chartReady,
          data: ventolone.time({
            group_level:dataFrequency,
            startkey:  JSON.stringify([$scope.plant].concat(timeFilter(dataFrequency, $scope.timeSpan.from))),
            endkey:  JSON.stringify([$scope.plant].concat(timeFilter(dataFrequency, $scope.timeSpan.to)).concat({}))
          }).$promise
        }).then(function(ready) {
          var dt = new google.visualization.DataTable()
              dtBattery = new google.visualization.DataTable()

          dt.addColumn('date', 'Date')
          dt.addColumn('number', 'Speed (m/s)')

          dtBattery.addColumn('date','Date')
          dtBattery.addColumn('number','Battery %')

          angular.forEach(ready.data, function(value, key) {
            var date = new Date(value.key[value.key.length - 1])

            dt.addRow([
              date,
              value.value.speed
            ])
            dtBattery.addRow([
              date,
              value.value.battery*100
            ])
          });

          $scope.data = dt
          $scope.dataBattery = dtBattery
        })
      }
    });

    function frequencyTimeFilter (dataFrequency, date, val) {
      if(date){
        var d = new Date(date)
            ,filter = [new Date(d.getUTCFullYear(), d.getMonth(), 1),val]

        for(var i=1; i<dataFrequency-1; i++){
          filter.push(new Date(date))
          filter.push(val)
        }
        return filter
      }
      return []
    }

    $scope.$watch('dataFrequency+plant+timeSpan.from+timeSpan.to',function () {
      var plant = $scope.plant
      var dataFrequency = $scope.dataFrequency
      var group_level = (dataFrequency-1)*2+1

      $q.all({
        chartReady:chartReady,
        stats: ventolone.stats({
          key: JSON.stringify([plant]),
          group_level:1
        }).$promise,
        frequency: ventolone.frequency({
          group_level: group_level,
          startkey: JSON.stringify([plant].concat(frequencyTimeFilter(dataFrequency, $scope.timeSpan.from, -100))),
          endkey: JSON.stringify([plant].concat(frequencyTimeFilter(dataFrequency, $scope.timeSpan.to, 100)))
        }).$promise
      }).then(function (data) {
        var total = data.stats.count
            ,dt = new google.visualization.DataTable()

        dt.addColumn('number', 'Speed (m/s)')
        dt.addColumn('number', '%')

        var d = {}

        angular.forEach(data.frequency, function(value, key) {
          d[value.key[group_level-1]]= (d[value.key[group_level-1]] || 0) + value.value
        });

        function byValue(a,b){return a-b}

        angular.forEach(Object.keys(d).map(parseFloat).sort(byValue), function(key){
          dt.addRow([parseFloat(key), parseInt(d[key])/total*100 ])
        });

        $scope.frequency = dt
      })
    })

})
.controller('UploadController',angular.noop)



angular.module('Ventolone.resources', ['ngResource'])
.factory('ventolone', function($resource) {

  function getRows(data) {
    return JSON.parse(data).rows
  }

//  return $resource('http://ventolone-litapp.rhcloud.com/ventolone_db/_design/charts/_view/:type', {
  return $resource('http://localhost:5984/ventolone/_design/charts/_view/:type', {
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
.factory('turbine', function($resource) {

  return $resource('http://localhost:5984/turbine/:id',{},{});
});