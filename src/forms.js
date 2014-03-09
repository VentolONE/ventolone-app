angular.module('Ventolone.forms', [])
  .directive('field', function($interpolate) {
    var templateTpl = $interpolate("partials/directives/fields/{{templateName}}.html"),
      templates = {
        'text': 'input',
        'number': 'input',
        'textarea': 'textarea',
        'select': 'select'
      }
    return {
      restrict: 'E',
      require: 'ngModel',
      scope: {
        'showHelp': '=help'
      },
      transclude: true,
      replace: true,
      link: function($scope, $element, $attrs, $controller) {
        $scope.texts = {}
        angular.forEach([
          'help',
          'label',
          'placeholder'
        ], function(value) {
          $scope.texts[value] = $attrs.ngModel + '.' + value
        });

        $scope.inputType = $attrs.type || 'text'

        var $input = $element.find($attrs.type)

        $controller.$render = function() {
          $input.val($controller.$viewValue || '');
        };

        $input.bind('blur keyup change', function() {
          $scope.$apply(function() {
            $controller.$setViewValue($input.val());
          });
        })
      },
      templateUrl: function($element, $attrs) {
        return templateTpl({
          templateName: templates[$attrs.type || 'text']
        })
      }
    }
  })
