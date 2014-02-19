angular.module('Ventolone', [
  'ngRoute'
  ,'ngGoogleCharts'
  ,'Ventolone.resources'
  ,'ngRouting'
])

  .config(function(routingProvider) {
    var resolve = {
      anemometer: function (Anemometer, $route, $routeParams) {
        return Anemometer.get({
          id:$route.current.pathParams.anemometerId
        }).$promise
      }
    }

    routingProvider
      .withResolve(resolve)
      .build([{
        model:'anemometer'
      }])
      .when('/anemometers/:anemometerId/upload',{
        templateUrl: 'views/anemometer/upload.html',
        controller:  'UploadController',
        resolve:     resolve
      })
      .when('/',{
        redirectTo:'/anemometers'
      })
  })
  .run( function($rootScope, routing) {
    $rootScope.h = routing.helpers
    $rootScope.h.anemometerUploadPath  = function(anemometerId){
      return $rootScope.h.anemometerPath(anemometerId)  + '/upload'
    }
    $rootScope.h.anemometerUploadRoute = function(anemometerId){
      return $rootScope.h.anemometerRoute(anemometerId) + '/upload'
    }
 })

.controller('NewAnemometerCtrl' , function ($scope, Anemometer, $location) {
  $scope.anemometer = {}
  $scope.submit = function  () {
    Anemometer.save($scope.anemometer).$promise.then(function (response) {
      $location.path($scope.h.anemometerRoute(response.id))
    })
  }
})
.controller('EditAnemometerCtrl', function ($scope, Anemometer, anemometer, $routeParams) {
  $scope.anemometer = anemometer
  $scope.submit = function  () {
    Anemometer.save($scope.anemometer)
  }
})
.controller('AnemometerListCtrl', function ($scope, Anemometer, $route) {
  Anemometer.query().$promise.then(function (anemometers) {
    $scope.anemometers = anemometers
  })

  $scope.delete = function(anemometer){
    Anemometer.delete({
      id:anemometer._id,
      rev:anemometer._rev
    },function () {
      $route.reload()
    })
  }
})
.controller('AnemometerCtrl', function ($scope, anemometer, $routeParams, Sample , chartReady , $q, $interpolate, $filter, params) {
  $scope.anemometer = anemometer

  $scope.options = {
      month: 2,
      day: 3,
      half_day: 4,
      hour: 5,
      half_hour:6,
      ten_minute: 7,
      minutes: 8
    }

    $scope.dataFrequency = 4

    $scope.timeSpan = {
      from: '2013-08-15'
      , to: '2013-09-15'
    }


    Sample.dates(function (dates) {
      $scope.timeSpan = {
        from: $filter('date')(new Date(dates.min*1000),'yyyy-MM-dd')
        , to: $filter('date')(new Date(dates.max*1000),'yyyy-MM-dd')
      }
    })

    params.then(function () {
      console.log(arguments)
    })

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
      if(dataFrequency && anemometer._id){
        $q.all({
          chartReady: chartReady,
          data: Sample.time({
            group_level:dataFrequency,
            startkey:  JSON.stringify([anemometer._id].concat(timeFilter(dataFrequency, $scope.timeSpan.from))),
            endkey:  JSON.stringify([anemometer._id].concat(timeFilter(dataFrequency, $scope.timeSpan.to)).concat({}))
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


          var tooltip = $interpolate('{{date | date:"dd/MM/yyyy - hh:mm"}} <br/> {{label}}: {{value|number}}');

          $scope.dtOptions = {
            'title': 'Velocità',
            tooltip: {isHtml: true}
          }

          $scope.dtBatteryOptions = {
            'title': 'Batteria',
            tooltip: {isHtml: true}
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
      var dataFrequency = $scope.dataFrequency
      var group_level = (dataFrequency-1)*2+1

      $q.all({
        chartReady:chartReady,
        stats: Sample.stats({
          key: JSON.stringify([anemometer._id]),
          group_level:1
        }).$promise,
        frequency: Sample.frequency({
          group_level: group_level,
          startkey: JSON.stringify([anemometer._id].concat(frequencyTimeFilter(dataFrequency, $scope.timeSpan.from, -100))),
          endkey: JSON.stringify([anemometer._id].concat(frequencyTimeFilter(dataFrequency, $scope.timeSpan.to, 100)))
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
.controller('UploadController',function ($scope, readFile, csvReader, upload, anemometer) {
    var iterator 
    $scope.$watch('importFile', function(file) {
      if(file){
        readFile(file).then(function (csv) {
          iterator = csvReader(csv)
          $scope.numberOfLines = iterator.size()
        })
      }
    })

    $scope.submit = function () {
      $scope.uploads = 0
      $scope.uploadsActive = true
      $scope.uploadsComplete = false
      
      var up = upload(anemometer, iterator)
      up.promise.then(
        function () {
          $scope.uploadsActive = false
          $scope.uploadsComplete = true
          $scope.importFile = null
          $scope.numberOfLines = null
        },
        angular.noop,
        function (val) {
          $scope.uploads++
          $scope.uploadsPerCent = $scope.uploads/up.numberOfUploads * 100 
        }
      )
    }
})

