angular.module('Ventolone.charts', [
  'ngGoogleCharts',
  'Ventolone.resources.services'
])
  .factory('TimeChartsData', function($q, chartReady) {
    return function(data, tooltipTmpl) {
      return $q.all({
        chartReady: chartReady,
        data: data
      }).then(function(ready) {
        var dt = new google.visualization.DataTable()
        dtBattery = new google.visualization.DataTable()

        dt.addColumn('date', 'Date')
        dt.addColumn('number', 'Speed (m/s)')
        dt.addColumn({
          type: 'string',
          role: 'tooltip',
          p: {
            html: true
          }
        })

        dtBattery.addColumn('date', 'Date')
        dtBattery.addColumn('number', 'Battery %')
        dtBattery.addColumn({
          type: 'string',
          role: 'tooltip',
          p: {
            html: true
          }
        })

        angular.forEach(ready.data, function(value, key) {
          var date = new Date(value.key[value.key.length - 1])

          dt.addRow([
            date,
            value.value.speed,
            tooltipTmpl({
              date: date,
              label: 'Speed (m/s)',
              value: value.value.speed
            })
          ])
          dtBattery.addRow([
            date,
            value.value.battery * 100,
            tooltipTmpl({
              date: date,
              label: 'Battery %',
              value: value.value.battery * 100
            })
          ])
        });

        return {
          speed: dt,
          battery: dtBattery
        }
      })
    }
  })
  .factory('FrequencyChartsData', function($q, chartReady, byValue) {
    return function(data, tooltipTmpl, group_level, total) {
      return $q.all({
        chartReady: chartReady,
        data: data
      }).then(function(ready) {
        var dt = new google.visualization.DataTable()

        dt.addColumn('number', 'Speed (m/s)')
        dt.addColumn('number', '%')

        var d = {}

        angular.forEach(data, function(value, key) {
          d[value.key[group_level - 1]] = (d[value.key[group_level - 1]] || 0) + value.value
        });

        angular.forEach(Object.keys(d).map(parseFloat).sort(byValue), function(key) {
          dt.addRow([parseFloat(key), parseInt(d[key]) / total * 100])
        });
        return dt
      })
    }
  })
  .factory('StatisticsChart', function(chartReady, $q, $filter) {
    return function(statistics, anemometer) {
      return $q.all([statistics, chartReady]).then(function(statistics) {
        var stats = statistics[0]

        var airDensity = 1.225 * Math.pow(1 - 0.000026 * anemometer.altitude, 4.256)
        stats.maxPowerExtractable = 0.593 * 0.5 * airDensity * Math.pow(stats.speed.cubicSum / stats.count, 1 / 3)

        return {
          battery: google.visualization.arrayToDataTable([
            ['Label', 'Value'],
            ['Battery', parseInt((stats.battery.sum / stats.count) * 100)]
          ]),
          speed: google.visualization.arrayToDataTable([
            ['Label', 'Value'],
            ['Speed', parseInt((stats.speed.sum / stats.count) * 100) / 100]
          ]),
          maxPowerExtractable: google.visualization.arrayToDataTable([
            ['Label', 'Value'],
            ['Potenziale', parseInt((stats.maxPowerExtractable) * 100) / 100]
          ]),
        }
      })
    }
  })
  .constant('byValue', function byValue(a, b) {
    return a - b
  })
