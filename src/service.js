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
  .factory('CsvIterator', function() {
    function splitRow(row) {
      return row.split(',').map(function(cell) {
        return angular.isNumber(cell) ? parseFloat(cell) : cell.trim()
      })
    }

    var CsvIterator = function(file) {
      this.rows = file.split('\n')
      return this
    }

    CsvIterator.prototype.next = function() {
      return splitRow(this.rows.shift())
    }

    CsvIterator.prototype.size = function() {
      return this.rows.length
    }

    CsvIterator.prototype.slice = function(begin, end) {
      return this.rows.slice(begin, end).map(splitRow)
    }

    CsvIterator.prototype.hasNext = function() {
      return !!this.rows.length
    }
    return CsvIterator
  })
  .factory('csvReader', function(CsvIterator) {
    return function(file) {
      return new CsvIterator(file)
    }
  })
  .factory('anemometerStats', function(Sample, StatisticsChart) {
    return function anemometerStats(anemometer) {
      return Sample.statistics({
        startkey: JSON.stringify([anemometer._id]),
        endkey: JSON.stringify([anemometer._id, {}])
      }, function(statistics) {
        if (statistics.time) {
          StatisticsChart(statistics, anemometer).then(function(stats) {
            statistics.time.min = new Date(statistics.time.min * 1000)
            statistics.time.max = new Date(statistics.time.max * 1000)
            anemometer.statistics = {
              chart: stats,
              data: statistics
            }
          })
        }
      }).$promise
    }
  })
