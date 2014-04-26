angular.module('Ventolone.i18n', [
  'pascalprecht.translate',
  'Ventolone.configuration'
])
  .config(function($translateProvider, configuration) {
    $translateProvider.useStaticFilesLoader({
      prefix: configuration.static_path + 'i18n/locale-',
      suffix: '.json'
    });
    $translateProvider.preferredLanguage('it');
  })
