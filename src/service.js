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

    function splitRow(row){
      return row.split(',').map(function(cell){
        return cell.trim()
      })
    }

    var CsvIterator = function (file) {
      this.rows = str.split('\n')
      return this
    }

    CsvIterator.prototype.next = function() {
      return splitRow(this.rows.shift())
    }

    CsvIterator.prototype.size = function() {
      return this.rows.length
    }

    CsvIterator.prototype.slice = function(begin,end) {
      return this.rows.slice(begin,end).map(splitRow)
    }

    CsvIterator.prototype.hasNext = function() {
      return !!this.rows.length
    }

    return function (file) {
      return new CsvIterator(file)
    }
  })
