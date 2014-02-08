angular.module('Ventolone', [
  'ngRoute'
  ,'ngGoogleCharts'
  ,'Ventolone.resources'
  ,'ngRouting'
])

  .config(function(routingProvider) {
    routingProvider.build([{
        model:'turbine'
      }])
      .when('/',{
        redirectTo:'/turbines'
      })
  })
  .run( function($rootScope, $location, $routeParams, routing) {
    $rootScope.h = routing.helpers
 })

.controller('NewTurbineCtrl' , function ($scope, Turbine, $location) {
  $scope.turbine = {}
  $scope.submit = function  () {
    Turbine.save($scope.turbine).$promise.then(function (response) {
      $location.path($scope.h.turbineRoute(response.id))
    })
  }
})
.controller('EditTurbineCtrl', function ($scope, Turbine, $routeParams) {
  $scope.turbine = Turbine.get({
    id:$routeParams.turbineId
  })
  $scope.submit = function  () {
    Turbine.save($scope.turbine)
  }
})
.controller('TurbineListCtrl', function ($scope, Turbine, $route) {
  Turbine.query().$promise.then(function (turbines) {
    $scope.turbines = turbines
  })

  $scope.delete = function(turbine){
    Turbine.delete({
      id:turbine._id,
      rev:turbine._rev
    },function () {
      $route.reload()
    })
  }
})
.controller('TurbineCtrl'    , function ($scope, Turbine, $routeParams, ventolone , chartReady , $q, $interpolate) {
  $scope.turbine = Turbine.get({
    id:$routeParams.turbineId
  })

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
          dt.addColumn({type: 'string', role: 'tooltip', p:{html:true}})

          dtBattery.addColumn('date','Date')
          dtBattery.addColumn('number','Battery %')
          dtBattery.addColumn({type: 'string', role: 'tooltip', p:{html:true}})


          var tooltip = $interpolate('{{date | date:"dd/MM/yyyy - hh:mm"}} \n {{label}}: {{value}}');

          $scope.dtOptions = {
            'title': 'Velocità'
          }

          $scope.dtBatteryOptions = {
            'title': 'Batteria'
          }

          $scope.dtFrequencyOptions = {
            'title': 'Frequenza'
          }

          angular.forEach(ready.data, function(value, key) {
            var date = new Date(value.key[value.key.length - 1])

            dt.addRow([
              date,
              value.value.speed,
              tooltip({date:date, label:'Speed (m/s)', value:value.value.speed})
            ])
            dtBattery.addRow([
              date,
              value.value.battery*100,
              tooltip({date:date, label:'Battery %', value:value.value.battery*100})
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
.factory('upload', function ($http) {
  return function (url, file, fileParam, params) {
    var fd = new FormData()
        , blob = new Blob([file], { type: "text/csv"})
    
    fd.append("importFile", blob);
    params && _.each(params, _.flip(fd.append,2).bind(fd))

    return $http.post(url, fd, {
      headers: {'Content-Type': undefined },
      transformRequest: angular.identity
    })
  }
})
