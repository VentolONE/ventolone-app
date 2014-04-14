// Karma configuration
// Generated on Wed Apr 09 2014 14:31:52 GMT+0200 (CEST)

module.exports = function(config) {
  config.set({

    basePath: '.',
    frameworks: ['mocha'],
    files: [
        'bower_components/should/should.js',
        "app/lib/angular.js",
        'bower_components/angular-mocks/angular-mocks.js',
        "app/lib/angular-locale_it-it.js",
        "app/lib/angular-route.js",
        "app/lib/angular-routing.js",
        "app/lib/angular-resource.js",
        "app/lib/angular-translate.js",
        "app/lib/angular-translate-loader-static-files.js",
        "app/src/configuration.js",
        "app/src/resources.js",
        "app/src/services.js",
        "app/src/google-charts.js",
        "app/src/resources-services.js",
        "app/src/routing.js",
        "app/src/directives.js",
        "app/src/charts.js",
        "app/src/forms.js",
        "app/src/controllers.js",
        "app/src/i18n.js",
        "app/src/main.js",
        
        "test/**/*.js"
    ],
    exclude: [],
    port: 9876,
    colors: true,
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DEBUG,
    autoWatch: false,
    browsers: ['Chrome', 'Firefox'],
    singleRun: false,
    preprocessors: {
      'app/src/*.js': 'coverage'
    },
    reporters : ['progress','coverage'],
    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    }
  });
};
