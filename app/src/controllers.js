angular.module('Ventolone.controllers', [
  'Ventolone.resources.services'
])
  .controller('NewAnemometerCtrl', function($scope, Anemometer, $location) {
    $scope.anemometer = {}
    $scope.submit = function() {
      Anemometer.save($scope.anemometer).$promise.then(function(response) {
        $location.path($scope.h.anemometerUploadRoute(response.id))
      })
    }
  })
  .controller('EditAnemometerCtrl', function($scope, Anemometer, anemometer, $location) {
    $scope.anemometer = anemometer
    $scope.submit = function() {
      Anemometer.save($scope.anemometer, function(response) {
        $location.path($scope.h.anemometerRoute(response._id))
      })
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
  .controller('AnemometerCtrl', function($scope, anemometer, anemometerService, Sample, $q, $interpolate, $filter, params, TimeChartsData, timeFilter, frequencyTimeFilter, FrequencyChartsData) {
    $scope.anemometer = anemometer

    params.then(function(p) {
      $scope.options = p.intervalsGroupLevels
    })

    $scope.dataFrequency = 4

    var statistics = Sample.statistics({
      startkey: JSON.stringify([anemometer._id]),
      endkey: JSON.stringify([anemometer._id, {}]),
    }, function(statistics) {
      if (statistics.time) {
        $scope.timeSpan = {
          from: new Date(statistics.time.min * 1000),
          to: new Date(statistics.time.max * 1000)
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
      $scope.showOverlay = true
      var dataFrequency = $scope.dataFrequency
      if (dataFrequency && anemometer._id) {
        TimeChartsData(anemometerService.samples(anemometer._id, $scope), tooltip).then(function(data) {
          $scope.data = data.speed
          $scope.dataBattery = data.battery
          $scope.showOverlay = false
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
  .controller('AnemometerUploadCtrl', function($scope, readFile, csvReader, batchUpload, anemometer, anemometerStats) {
    $scope.anemometer = anemometer
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
      $scope.uploadErrors = 0
      $scope.uploadsActive = true
      $scope.uploadsComplete = false
      $scope.uploadErrorsProgress = 0

      var up = batchUpload(anemometer, iterator)
      up.promise.then(
        function() {
          $scope.uploadsActive = false
          $scope.uploadsComplete = true
          $scope.importFile = null
          $scope.numberOfLines = null

          anemometerStats(anemometer).then(function() {
            $scope.uploadsComplete = false
            $scope.processingComplete = true
          })
        },
        function() {
          $scope.uploadErrors++
          $scope.uploadErrorsProgress = $scope.uploadErrors / up.numberOfUploads
        },
        function(val) {
          $scope.uploads++
          $scope.uploadsProgress = $scope.uploads / up.numberOfUploads
          $scope.uploadsPercent = $scope.uploads / up.numberOfUploads * 100
        }
      )
    }
  })
