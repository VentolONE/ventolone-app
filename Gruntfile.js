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
        basePath: 'http://localhost:5984/ventolone%2F',
        user: 'admin',
        password: 'password'
      }
    }, grunt.file.readJSON(CONFIG_PATH)[process.env.VENTOLONE_ENV || 'dev']),
    'couch-push': {
      localhost: {
        files: {
          '<%=env.couchdb.basePath %>sample': 'design_docs.json'
        }
      }
    },
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
        files: ['src/*.js'],
        tasks: ['modules-graph', 'graphviz:dependencies']
      },
    },
    'modules-graph': {
      dependencies: {
        files: {
          'dependencies-graph.dot': ['src/*.js']
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
        src: ['dist/src/configuration.js'],
        overwrite: true,
        replacements: [{
          from: 'http://localhost:5984/ventolone%2F',
          to: '<%= env.couchdb.basePath%>'
        }]
      }
    }
  });

  var httpConfig = {
    options: {
      ignoreErrors: true
    }
  }

  _.each(['sample', 'anemometer'], function(db) {
    _.each(
      _.zipObject(['create', 'drop'], ['PUT', 'DELETE']), function(method, action) {
        httpConfig[action + '-' + db + '-db'] = {
          options: {
            url: '<%= env.couchdb.basePath %>' + db,
            method: method
          }
        }
      })
  })

  grunt.config.set('http', httpConfig)

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-couch');
  grunt.loadNpmTasks('grunt-http');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-graphviz');
  grunt.loadNpmTasks('grunt-angular-modules-graph');
  grunt.loadNpmTasks('grunt-bower');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-text-replace');

  grunt.task.registerTask('recreate-sample-db', [
    'http:drop-sample-db', 'http:create-sample-db', 'couch'
  ]);

  grunt.task.registerTask('reset-db', [
    'http:drop-sample-db', 'http:create-sample-db', 'http:drop-anemometer-db', 'http:create-anemometer-db', 'couch'
  ]);
};
