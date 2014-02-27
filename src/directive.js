angular.module('Ventolone')
  .directive('vField',function(){
    return{
      restrict:'E',
      require: 'ngModel',
      scope:true,
      link: function (scope,element,attrs,controller) {
        scope.texts = {}
        angular.forEach([
          'help',
          'label',
          'placeholder'
        ], function(value){
          scope.texts[value]=value+'.'+attrs.ngModel
         });

        element.bind('change',function () {
          scope.$apply(function () {
            controller.$setViewValue(angular.element(this).val());
          });
        })
      },
      template:''
        +'  <div class="form-group">'
        +'    <label>{{texts.label}}</label>'
        +'    <input class="form-control" placeholder="{{text.placeholder}}" >'
        +'    <p class="help-block">{{texts.help}}</p>'
        +'  </div>'
    }
  })
  .directive('file',function ($interpolate) {
    var fileName = $interpolate("[{{name}} ({{size/1024|number:'1'}}kb)]")
    return {
      replace: true,
      template: '<button class="btn btn-primary" >'+
                '  <input type="file" style="opacity:0; width:0; height: 0"></input>'+
                '  <span ng-transclude>'+
                '  </span>'+
                '  <div style="display:inline; font-style:italic;"></div>'+
                '</button>',
      restrict:'E',
      require: 'ngModel',
      transclude:true,
      link: function (scope, element, attrs, ngModel) {
        var $input = element.find('input')
            , $button = element
            , $fileName = element.find('div')

        ngModel.$render = function() {
          var file = ngModel.$viewValue
          $fileName.text(file ? fileName(file) : '')
        }

        $input.bind('change',function () {
          scope.$apply(function () {
            var file = $input[0].files[0]
            ngModel.$setViewValue(file)
            ngModel.$render()
          });
        })


        $button.bind('click', function () {
          $input[0].click()
        })
      }
    }
  })
  .directive('icon', function () {
    return {
      restrict:'E',
      scope:{
        name: '@'
      },
      replace:true,
      template:'<i class="fa fa-{{name}}"></i>'
    }
  })
  .directive('progressBar',function ($interval) {
    return {
      restrict:'E',
      replace:true,
      scope: {
        value: '=',
        type: '=',
        active: '=',
        text: '@',
        striped: '=',
        bouncing:'@'
      },
      template:''+
      '<div class="progress active" ng-class="{active: active, \'progress-striped\': striped }">'+
      '  <div class="progress-bar progress-bar-{{type}}" role="progressbar" ng-style="style" style="width: {{value || 100}}%;">'+
      '    <span class="sr-only">{{text}}</span>'+
      '  </div>'+
      '</div>',
      link: function ($scope, $element, $attrs) {
        $scope.$watch('value',function (value) {
          $scope.style={
            width: (value||0)*100 +'%'
          }
        })
      }
    }
  })
  .directive('anemometerPanel', function ($rootScope) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'partials/anemometer-panel.html',
      scope: {
        anemometer: '='
      },
      link:function ($scope) {
        $scope.h = $rootScope.h
      }
    }
  })