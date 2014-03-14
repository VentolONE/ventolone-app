angular.module('Ventolone.app', [
  'Ventolone.controllers',
  'Ventolone.directives',
  'Ventolone.routing',
  'Ventolone.i18n',
  'Ventolone.forms'
])

applicationCache.addEventListener('updateready', function() {        
  window.location.reload();
});