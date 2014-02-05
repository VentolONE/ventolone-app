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
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-couch');
};
