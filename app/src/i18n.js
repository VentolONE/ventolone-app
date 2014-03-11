angular.module('Ventolone.i18n', [
  'pascalprecht.translate'
])
  .config(function($translateProvider) {
    $translateProvider.useStaticFilesLoader({
      prefix: 'i18n/locale-',
      suffix: '.json'
    });
    $translateProvider.preferredLanguage('it');
  })
