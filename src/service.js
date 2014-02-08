angular.module('Ventolone')
  .factory('readFile', function($q, $rootScope) {
    return function(file) {
      var fr = new FileReader(),
        deferred = $q.defer()

        fr.addEventListener('load', function(event) {
          $rootScope.$apply(function() {
            deferred.resolve(event.target.result)
          })
        })

        if (!file) {
          deferred.reject()
        } else {
          fr.readAsText(file)
        }

      return deferred.promise
    }
  })
  .factory('csvReader',function () {

    var LineIterator = function (str) {
      this.lines = str.split('\n')
      return this
    }

    LineIterator.prototype.next = function() {
      return this.lines.shift()
    };
    LineIterator.prototype.hasNext = function() {
      return !!this.lines.length
    };
    LineIterator.prototype.size = function() {
      return this.lines.length
    };    


    var CsvIterator = function (file, options) {
      LineIterator.call(this, file)
      return this
    }

    function splitRow(row){
      return row.split(',').map(function(cell){
        return cell.trim()
      })
    }

    CsvIterator.prototype = LineIterator

    CsvIterator.prototype.next = function() {
      return splitRow(this.prototype.next.call(this))
    };

    CsvIterator.prototype.size = function() {
      return this.prototype.size.call(this)
    };

    CsvIterator.prototype.slice = function(begin,end) {
      return this.lines.slice(begin,end).map(splitRow)
    };

    return function (file, options) {
      return new CsvIterator(file, options)
    }
  })
