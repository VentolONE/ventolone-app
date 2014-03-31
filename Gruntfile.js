'use strict';

var _ = require('lodash'),
  CONFIG_PATH = '.config.json'

module.exports = function(grunt) {

  if (!grunt.file.exists(CONFIG_PATH)) {
    grunt.file.write(CONFIG_PATH, JSON.stringify({
      dev: {}
    }))
  }

  grunt.initConfig({
    pkg: grunt.file.readJSON('bower.json'),
    env: _.extend({
      couchdb: {
        basePath: 'http://localhost:5984/ventolone%2F'
      },
      deploy: {}
    }, grunt.file.readJSON(CONFIG_PATH)[process.env.VENTOLONE_ENV || 'dev']),
    'couch-compile': {
      app: {
        files: {
          'design_docs.json': 'couchdb/*'
        }
      }
    },
    connect: {
      server: {
        options: {
          port: 8000,
          keepalive: true,
          base: 'app'
        }
      }
    },
    graphviz: {
      dependencies: {
        files: {
          'dependencies-graph.png': 'dependencies-graph.dot',
        }
      },
    },
    watch: {
      'dependencies': {
        files: ['app/src/*.js'],
        tasks: ['modules-graph', 'graphviz:dependencies']
      },
    },
    'modules-graph': {
      dependencies: {
        files: {
          'dependencies-graph.dot': ['app/src/*.js']
        }
      }
    },
    bower: {
      deploy: {
        dest: 'app/lib',
        options: {
          packageSpecific: {
            'angular-i18n': {
              files: [
                "angular-locale_it-it.js"
              ]
            }
          }
        }
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dest: "dist",
          cwd: 'app/',
          src: ['**']
        }]
      },
      deploy: {
        files: [{
          expand: true,
          dest: "<%=env.deploy.path%>",
          cwd: 'dist/',
          src: ['**']
        }]
      }
    },
    replace: {
      dist: {
        src: ['dist/src/configuration.js', 'dist/index.html'],
        overwrite: true,
        replacements: [{
          from: 'http://localhost:5984/ventolone%2F',
          to: '<%= env.couchdb.basePath%>'
        }, {
          from: '<html lang="en" ng-app="Ventolone.app">',
          to: '<html lang="en" ng-app="Ventolone.app" manifest="manifest.appcache">'
        }]
      }
    },
    appcache: {
      options: {
        basePath: 'dist'
      },
      all: {
        dest: 'dist/manifest.appcache',
        cache: 'dist/**/*.{js,css,html}',
        network: '*'
      }
    }
  });

  var couchPushOptions = {
    localhost: {
      files: {
        '<%=env.couchdb.basePath %>sample': 'design_docs.json'
      }
    }
  }

  var auth = grunt.config().env.couchdb.auth
  if (auth) {
    couchPushOptions.options = {
      user: auth.user,
      pass: auth.password
    }
  }

  var httpConfig = {
    options: {
      ignoreErrors: true,
    }
  }

  _.each(['sample', 'anemometer'], function(db) {
    _.each(
      _.zipObject(['create', 'drop'], ['PUT', 'DELETE']), function(method, action) {
        httpConfig[action + '-' + db + '-db'] = {
          options: {
            url: '<%= env.couchdb.basePath %>' + db,
            method: method,
            auth: auth
          }
        }
      })
  })

  grunt.config.set('http', httpConfig)
  grunt.config.set('couch-push', couchPushOptions)
  grunt.config.set('processhtml',{
    'dist/index.html':['dist/index.html']
  })

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-couch');
  grunt.loadNpmTasks('grunt-http');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-graphviz');
  grunt.loadNpmTasks('grunt-angular-modules-graph');
  grunt.loadNpmTasks('grunt-bower');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-appcache');
  grunt.loadNpmTasks('grunt-processhtml');

  grunt.task.registerTask('recreate-sample-db', [
    'http:drop-sample-db', 'http:create-sample-db', 'couch'
  ]);

  grunt.task.registerTask('reset-db', [
    'http:drop-sample-db', 'http:create-sample-db', 'http:drop-anemometer-db', 'http:create-anemometer-db', 'couch'
  ]);

  grunt.registerTask('ship-it', ["bower", "copy:dist", "appcache", "processhtml", "replace:dist", "copy:deploy"])
};
