angular.module('Ventolone.configuration', [])
  .constant('configuration', {
    static_path: '',
    resources: {
      dbUrl: '/db',
      basePath: '/db/ventolone_',
      numberOfDocs: 10000
    }
  })
