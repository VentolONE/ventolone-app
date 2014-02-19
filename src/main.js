angular.module('Ventolone', [
  'ngRoute', 'Ventolone.charts', 'Ventolone.resources', 'ngRouting'
])
  .config(function(routingProvider) {
    var resolve = {
      anemometer: function(Anemometer, $route, $routeParams) {
        return Anemometer.get({
          id: $route.current.pathParams.anemometerId
        }).$promise
      }
    }

    routingProvider
      .withResolve(resolve)
      .build([{
        model: 'anemometer'
      }])
      .when('/anemometers/:anemometerId/upload', {
        templateUrl: 'views/anemometer/upload.html',
        controller: 'UploadController',
        resolve: resolve
      })
      .when('/', {
        redirectTo: '/anemometers'
      })
  })
  .run(function($rootScope, routing) {
    $rootScope.h = routing.helpers
    $rootScope.h.anemometerUploadPath = function(anemometerId) {
      return $rootScope.h.anemometerPath(anemometerId) + '/upload'
    }
    $rootScope.h.anemometerUploadRoute = function(anemometerId) {
      return $rootScope.h.anemometerRoute(anemometerId) + '/upload'
    }
  })
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
  .controller('AnemometerListCtrl', function($scope, Anemometer, $route) {
    Anemometer.query().$promise.then(function(anemometers) {
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

    $scope.timeSpan = {
      from: '2013-08-15',
      to: '2013-09-15'
    }


    Sample.dates(function(dates) {
      $scope.timeSpan = {
        from: $filter('date')(new Date(dates.min * 1000), 'yyyy-MM-dd'),
        to: $filter('date')(new Date(dates.max * 1000), 'yyyy-MM-dd')
      }
    })

    params.then(function() {
      console.log(arguments)
    })

    var intervals = [3600 * 24, 3600 * 6, 3600, 1800, 600, 60]

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

    $scope.$watch('dataFrequency', updateTimeCharts)
    $scope.$watch('timeSpan.to', updateTimeCharts)
    $scope.$watch('timeSpan.from', updateTimeCharts)

    var stats = Sample.stats({
      key: JSON.stringify([anemometer._id]),
      group_level: 1
    })

      function updateFrequencyCharts() {
        var dataFrequency = $scope.dataFrequency,
          group_level = (dataFrequency - 1) * 2 + 1,
          frequency = Sample.frequency({
            group_level: group_level,
            startkey: JSON.stringify([anemometer._id].concat(frequencyTimeFilter(dataFrequency, $scope.timeSpan.from, -100))),
            endkey: JSON.stringify([anemometer._id].concat(frequencyTimeFilter(dataFrequency, $scope.timeSpan.to, 100)))
          })

          $q.all({
            stats: stats.$promise,
            frequency: frequency.$promise
          }).then(function(data) {
            $scope.frequency = FrequencyChartsData(data.frequency, angular.noop, group_level, data.stats.count)
          })
      }

    $scope.$watch('dataFrequency', updateFrequencyCharts)
    $scope.$watch('timeSpan.to', updateFrequencyCharts)
    $scope.$watch('timeSpan.from', updateFrequencyCharts)

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
          $scope.uploadsPerCent = $scope.uploads / up.numberOfUploads * 100
        }
      )
    }
  })
