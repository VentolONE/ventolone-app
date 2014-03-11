angular.module('Ventolone.configuration', [])
  .constant('configuration', {
    resources: {
      basePath: 'http://localhost:5984/ventolone%2F',
      numberOfDocs: 10000
    }
  })
