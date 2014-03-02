'use strict';

module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    'couch-push': {
      localhost: {
        files: {
          'http://localhost:5984/ventolone%2Fsample': 'design_docs.json'
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
          keepalive: true
        }
      }
    },
    http: {
      'drop-sample-db': {
        options: {
          url: 'http://localhost:5984/ventolone%2Fsample',
          method: 'DELETE',
          ignoreErrors: true
        }
      },
      'drop-anemometer-db': {
        options: {
          url: 'http://localhost:5984/ventolone%2Fanemometer',
          method: 'DELETE',
          ignoreErrors: true
        }
      },
      'create-sample-db': {
        options: {
          url: 'http://localhost:5984/ventolone%2Fsample',
          method: 'PUT',
          ignoreErrors: true
        }
      },
      'create-anemometer-db': {
        options: {
          url: 'http://localhost:5984/ventolone%2Fanemometer',
          method: 'PUT',
          ignoreErrors: true
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
        files: ['dependencies-graph.dot'],
        tasks: ['graphviz:dependencies']
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-couch');
  grunt.loadNpmTasks('grunt-http');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-graphviz');

  grunt.task.registerTask('recreate-sample-db', [
    'http:drop-sample-db', 'http:create-sample-db', 'couch'
  ]);

  grunt.task.registerTask('reset-db', [
    'http:drop-sample-db', 'http:create-sample-db', 'http:drop-anemometer-db', 'http:create-anemometer-db', 'couch'
  ]);
};
