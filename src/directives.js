angular.module('Ventolone.directives', [
  'Ventolone.services',
  'Ventolone.resources.services'
])
  .directive('field', function() {
    return {
      restrict: 'E',
      require: 'ngModel',
      scope: true,
      replace: true,
      link: function(scope, element, attrs, controller) {
        scope.texts = {}
        angular.forEach([
          'help',
          'label',
          'placeholder'
        ], function(value) {
          scope.texts[value] = value + '.' + attrs.ngModel
        });

        if(!attrs.help){
          delete scope.texts.help
        }

        var $input = element.find('input')

        controller.$render = function() {
          $input.val(controller.$viewValue || '');
        };

        $input.bind('blur keyup change', function() {
          scope.$apply(function() {
            controller.$setViewValue($input.val());
          });
        })
      },
      templateUrl: 'partials/directives/field.html'
    }
  })
  .directive('file', function($interpolate) {
    var fileName = $interpolate("[{{name}} ({{size/1024|number:'1'}}kb)]")
    return {
      replace: true,
      templateUrl: 'partials/directives/file.html',
      restrict: 'E',
      require: 'ngModel',
      transclude: true,
      link: function(scope, element, attrs, ngModel) {
        var $input = element.find('input'),
          $button = element,
          $fileName = element.find('div')

          ngModel.$render = function() {
            var file = ngModel.$viewValue
            $fileName.text(file ? fileName(file) : '')
          }

        $input.bind('change', function() {
          scope.$apply(function() {
            var file = $input[0].files[0]
            ngModel.$setViewValue(file)
            ngModel.$render()
          });
        })


        $button.bind('click', function() {
          $input[0].click()
        })
      }
    }
  })
  .directive('icon', function() {
    return {
      restrict: 'E',
      scope: {
        name: '@'
      },
      replace: true,
      template: '<i class="fa fa-{{name}}"></i>'
    }
  })
  .directive('progressBar', function($interval) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        value: '=',
        error: '=',
        type: '=',
        active: '=',
        text: '@',
        striped: '=',
        bouncing: '@'
      },
      template: '' + '<div class="progress active" ng-class="{active: active, \'progress-striped\': striped }">' + '  <div class="progress-bar progress-bar-{{type}}" role="progressbar" ng-style="style" style="width: {{value || 100}}%;">' + '    <span class="sr-only">{{text}}</span>' + '  </div>' + '  <div class="progress-bar progress-bar-danger" role="progressbar" ng-style="styleError">' + '    <span class="sr-only">{{text}}</span>' + '  </div>' + '</div>',
      link: function($scope, $element, $attrs) {
        $scope.$watch('value', function(value) {
          $scope.style = {
            width: (value || 0) * 100 + '%'
          }
        })
        $scope.$watch('error', function(value) {
          $scope.styleError = {
            width: (value || 0) * 100 + '%'
          }
        })
      }
    }
  })
  .directive('anemometerPanel', function($rootScope, anemometerStats, timeFilter) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'partials/anemometer-panel.html',
      scope: {
        anemometer: '=',
        from: '=',
        to: '=',
        dataFrequency: '=frequency'
      },
      link: function($scope) {
        $scope.h = $rootScope.h

        function update() {
          anemometerStats($scope.anemometer, $scope)
        }

        $scope.$watch('dataFrequency', update)
        $scope.$watch('from', update)
        $scope.$watch('to', update)
      }
    }
  })
