angular.module('Ventolone.controllers',[])
.controller('NewAnemometerCtrl', function($scope, Anemometer, $location) {
    $scope.anemometer = {}
    $scope.submit = function() {
      Anemometer.save($scope.anemometer).$promise.then(function(response) {
        $location.path($scope.h.anemometerRoute(response.id))
      })
    }
  })
  .controller('EditAnemometerCtrl', function($scope, Anemometer, anemometer, $routeParams) {
    $scope.anemometer = anemometer
    $scope.submit = function() {
      Anemometer.save($scope.anemometer)
    }
  })
  .controller('AnemometerListCtrl', function($scope, Anemometer, $route, Sample, StatisticsChart) {
    $scope.options = {
      width: 400, height: 120,
      redFrom: 90, redTo: 100,
      yellowFrom:75, yellowTo: 90,
      minorTicks: 5
    };

    Anemometer.query().$promise.then(function(anemometers) {
      anemometers.map(function (anemometer) {
        Sample.statistics({
          startkey: JSON.stringify([anemometer._id]),
          endkey: JSON.stringify([anemometer._id,{}])
        },function (statistics) {
          if(statistics.time){
            StatisticsChart(statistics,anemometer).then(function (stats) {
              statistics.time.min = new Date(statistics.time.min*1000)
              statistics.time.max = new Date(statistics.time.max*1000)
              anemometer.statistics = {
                chart : stats,
                data: statistics
              }
            })
          }
        })
      })
      $scope.anemometers = anemometers
    })

    $scope.delete = function(anemometer) {
      Anemometer.delete({
        id: anemometer._id,
        rev: anemometer._rev
      }, function() {
        $route.reload()
      })
    }
  })
  .controller('AnemometerCtrl', function($scope, anemometer, Sample, $q, $interpolate, $filter, params, TimeChartsData, timeFilter, frequencyTimeFilter, FrequencyChartsData) {
    $scope.anemometer = anemometer

    $scope.options = {
      month: 2,
      day: 3,
      half_day: 4,
      hour: 5,
      half_hour: 6,
      ten_minute: 7,
      minutes: 8
    }

    $scope.dataFrequency = 4

    var statistics = Sample.statistics({
      startkey: JSON.stringify([anemometer._id]),
      endkey: JSON.stringify([anemometer._id,{}]),
    },function (statistics) {
      if(statistics.time){
        $scope.timeSpan = {
          from: $filter('date')(new Date(statistics.time.min * 1000), 'yyyy-MM-dd'),
          to: $filter('date')(new Date(statistics.time.max * 1000), 'yyyy-MM-dd')
        }

        $scope.$watch('dataFrequency', updateTimeCharts)
        $scope.$watch('timeSpan.to', updateTimeCharts)
        $scope.$watch('timeSpan.from', updateTimeCharts)

        $scope.$watch('dataFrequency', updateFrequencyCharts)
        $scope.$watch('timeSpan.to', updateFrequencyCharts)
        $scope.$watch('timeSpan.from', updateFrequencyCharts)
      }
    })

    var tooltip = $interpolate('{{date | date:"dd/MM/yyyy - hh:mm"}} <br/> {{label}}: {{value|number}}');

    function updateTimeCharts() {
      var dataFrequency = $scope.dataFrequency
      if (dataFrequency && anemometer._id) {
        var samples = Sample.time({
          group_level: dataFrequency,
          startkey: JSON.stringify([anemometer._id].concat(timeFilter(dataFrequency, $scope.timeSpan.from))),
          endkey: JSON.stringify([anemometer._id].concat(timeFilter(dataFrequency, $scope.timeSpan.to)).concat({}))
        })

        TimeChartsData(samples.$promise, tooltip).then(function(data) {
          $scope.data = data.speed
          $scope.dataBattery = data.battery
        })
      }
    }


      function updateFrequencyCharts() {
        var dataFrequency = $scope.dataFrequency,
          group_level = (dataFrequency - 1) * 2 + 1,
          frequency = Sample.frequency({
            group_level: group_level,
            startkey: JSON.stringify([anemometer._id].concat(frequencyTimeFilter(dataFrequency, $scope.timeSpan.from, -100))),
            endkey: JSON.stringify([anemometer._id].concat(frequencyTimeFilter(dataFrequency, $scope.timeSpan.to, 100)))
          })

          $q.all({
            statistics: statistics.$promise,
            frequency: frequency.$promise
          }).then(function(data) {
            $scope.frequency = FrequencyChartsData(data.frequency, angular.noop, group_level, data.statistics.count)
          })
      }


  })
  .controller('UploadController', function($scope, readFile, csvReader, upload, anemometer) {
    var iterator
    $scope.$watch('importFile', function(file) {
      if (file) {
        readFile(file).then(function(csv) {
          iterator = csvReader(csv)
          $scope.numberOfLines = iterator.size()
        })
      }
    })

    $scope.submit = function() {
      $scope.uploads = 0
      $scope.uploadsActive = true
      $scope.uploadsComplete = false

      var up = upload(anemometer, iterator)
      up.promise.then(
        function() {
          $scope.uploadsActive = false
          $scope.uploadsComplete = true
          $scope.importFile = null
          $scope.numberOfLines = null
        },
        angular.noop,
        function(val) {
          $scope.uploads++
          $scope.uploadsProgress = $scope.uploads / up.numberOfUploads
          $scope.uploadsPercent  = $scope.uploads / up.numberOfUploads * 100
        }
      )
    }
  })
