angular.module('Ventolone.services', [
  'Ventolone.charts',
  'Ventolone.resources.services'
])
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
        return !isNaN(cell) ? parseFloat(cell) : cell.trim()
      })
    }

    var CsvIterator = function(file) {
      this.rows = file ? file
        .replace(/(^\n|\n$)/,'')
        .split(/\n+/) : []
      return this
    }

    CsvIterator.prototype.next = function() {
      if(!this.hasNext()){
        throw new Error('No items left')
      }
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
  .factory('anemometerStats', function(StatisticsChart, anemometerService, $q) {
    return function anemometerStats(anemometer, params) {
      var deferred = $q.defer()
      anemometerService
        .statistics(anemometer._id, params)
        .then(function(statistics) {
          if (statistics.time) {
            StatisticsChart(statistics, anemometer).then(function(stats) {
              statistics.time.min = new Date(statistics.time.min * 1000)
              statistics.time.max = new Date(statistics.time.max * 1000)
              anemometer.statistics = {
                chart: stats,
                data: statistics
              }
              deferred.resolve()
            })
          } else {
            deferred.reject()
          }
        })
      return deferred.promise
    }
  })
