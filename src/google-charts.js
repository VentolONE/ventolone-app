angular.module('ngGoogleCharts', [])
  .factory('chartReady', ["$q", "$window", "$rootScope",
    function($q, $window, $rootScope) {
      var deferred = $q.defer()
      google.load('visualization', '1.0', {
        'packages': ['controls', 'corechart'],
        'language': document.documentElement.lang,
        'callback': function() {
          $rootScope.$apply(function() {
            deferred.resolve()
          })
        }
      });
      return deferred.promise
  }])
  .directive('chart', function(chartReady,$q){
    return {
      restrict: 'E',
      scope:{
        data:'=',
        options: '=',
        title: '@'
      },
      template:'<div></div>',
      replace:true,
      link: function($scope,$element,$attrs){
        var options = angular.extend({
          title: $attrs.title,
          tooltip: {
            isHtml: true
          }
        }, $scope.options)

        chartReady.then(function(){
          $scope.$watch('data',function (data) {
            if(data){
              $q.when(data).then(function (data) {
                var dataTable = data instanceof google.visualization.DataTable
                                  ? data
                                  : google.visualization.arrayToDataTable(data),
                    chart     = $scope.chart || new google.visualization[$attrs.chartType]($element[0]);

                chart.draw(dataTable, options);
              })
            }


          })
        })
      }
    }
  })