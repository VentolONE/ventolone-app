var ngGoogleCharts = angular.module('ngGoogleCharts', [])
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
        data:'='
      },
      template:'<div></div>',
      replace:true,
      link: function($scope,$element,$attrs){
        chartReady.then(function(){
          $scope.$watch('data',function (data) {
            if(data){
              var dataTable = data instanceof google.visualization.DataTable 
                                ? data 
                                : google.visualization.arrayToDataTable(data),
                  chart     = $scope.chart || new google.visualization['LineChart']($element[0]);

              chart.draw(dataTable, {
                hAxis:{
                  slantedTextAngle:0
                },
                vAxis:{
                  baseline:0
                }
              });
            }
          })
        })
      }
    }
  })