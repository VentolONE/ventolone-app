'use strict';

module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    'couch-push': {
      localhost: {
        files: {
          'http://localhost:5984/ventolone': 'design_docs.json'
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
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-couch');
};
