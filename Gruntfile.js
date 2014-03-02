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
        files: ['src/*.js'],
        tasks: ['generate-graph','graphviz:dependencies']
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

  grunt.registerTask('generate-graph', 'Generate dependencies graph', function() {

    function addName(name) {
      this.items.push(name)
      return this
    }

    function Module(name, deps) {
      this.name = name
      this.modules = deps
      this.items = []
    }

    var methods = ['constant', 'controller', 'directive', 'factory', 'filter', 'provider', 'service', 'value']

    methods.forEach(function(method) {
      Module.prototype[method] = function(name) {
        return addName.call(this, name)
      }
    })

    Module.prototype.run = function() {
      return this
    };
    Module.prototype.config = function() {
      return this
    };

    var angular = {
      modules: [],
      module: function(name, deps) {
        var module = new Module(name, deps)
        this.modules.push(module)
        return module
      }
    }

    grunt.file.recurse('src/', function(abspath) {
      var file = grunt.file.read(abspath)
      eval(file)
    })

    var modulesDefinition = angular.modules.reduce(function(acc, module) {
      var label = '[label="{' + module.name + '|' + module.items.join('\\n') + '}"]'
      return '"' + module.name + '"' + label + "\n" + acc
    }, "")

    modulesDefinition = angular.modules.reduce(function(acc, module) {
      return acc + "\n" + module.modules.reduce(function(depAcc, dep) {
        console.log(module.name, '->', dep)
        return depAcc + "\n" + '"' + module.name + '" -> "' + dep + '"'
      }, "")
    }, modulesDefinition)

    grunt.file.write('dependencies-graph.dot', "digraph dependencies{\n\tnode[shape=\"record\"] \n" + modulesDefinition + "\n}")
  });
};
