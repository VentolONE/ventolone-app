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
    var fileName = $interpolate("{{name}} ({{size/1024|number:'1'}}kb)")
    return {
      replace: true,
      template: '<span>'+
                '  <input type="file" style="opacity:0; width:0"></input>'+
                '  <button class="btn btn-primary" ng-transclude>'+
                '  </button>'+
                '  <div></div>'+
                '</span>',
      restrict:'E',
      require: 'ngModel',
      transclude:true,
      link: function (scope, element, attrs, ngModel) {
        var $input = element.find('input')
            , $button = element.find('button')
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