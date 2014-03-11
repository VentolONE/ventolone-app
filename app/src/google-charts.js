angular.module('ngGoogleCharts', [])
  .factory('chartReady', ["$q", "$window", "$rootScope",
    function($q, $window, $rootScope) {
      var deferred = $q.defer()
      google.load('visualization', '1.0', {
        'packages': ['controls', 'corechart','gauge'],
        'language': document.documentElement.lang,
        'callback': function() {
          $rootScope.$apply(function() {
            deferred.resolve()
          })
        }
      });
      return deferred.promise
    }
  ])
  .directive('chart', function(chartReady, $q) {
    return {
      restrict: 'E',
      scope: {
        data: '=',
        options: '=',
        title: '@'
      },
      template: '<div></div>',
      replace: true,
      link: function($scope, $element, $attrs) {
        var options = angular.extend({
          title: $attrs.title,
          tooltip: {
            isHtml: true
          }
        }, $scope.options)

        chartReady.then(function() {
          $scope.$watch('data', function(data) {
            if (data) {
              $q.when(data).then(function(data) {
                var dataTable = data instanceof google.visualization.DataTable ? data : google.visualization.arrayToDataTable(data)
                    , chart = $scope.chart || new google.visualization[$attrs.chartType]($element[0]);

                $scope.chart = chart
                chart.draw(dataTable, options);
              })
            }
          })
        })
      }
    }
  })
  .directive('gaugeChart', function (chartReady, $q) {
    return {
      restrict:'E',
      scope: {
        data:'=',
        options:'=',
        red:'=',
        green:'=',
        yellow:'=',
        max:'@',
        min:'@',
      },
      replace: true,
      template:'<div></div>',
      link: function ($scope, $element, $attrs) {
        var options = angular.extend({
          redFrom: $scope.red[0]
          ,redTo: $scope.red[1]
          ,greenFrom: $scope.green[0]
          ,greenTo: $scope.green[1]
          ,yellowFrom: $scope.yellow[0]
          ,yellowTo: $scope.yellow[1]
          ,max: $scope.max
          ,min: $scope.min
          ,width: 220
          ,height: 220
        }, $scope.options)

        chartReady.then(function () {
          $scope.$watch('data',function (data) {
            if(data){
              $q.when(data).then(function (data) {
                var dataTable = data instanceof google.visualization.DataTable ? data : google.visualization.arrayToDataTable(data)
                    , chart = $scope.chart || new google.visualization['Gauge']($element[0]);

                $scope.chart = chart
                chart.draw(dataTable, options);
              })
            }
          })
        })
      }
    }
  })
