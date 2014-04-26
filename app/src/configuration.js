angular.module('Ventolone.configuration', [])
  .constant('configuration', {
    resources: {
      dbUrl: 'http://dev.ventolone.local:8000',
      basePath: 'http://dev.ventolone.local:8000/ventolone%2F',
      numberOfDocs: 10000
    }
  })
