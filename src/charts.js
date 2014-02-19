/**
* Ventolone.charts Module
*
* 
*/
angular.module('Ventolone.charts', ['ngGoogleCharts'])
  .factory('TimeChartsData', function($q, chartReady){
    return function (data, tooltipTmpl) {
      return $q.all({
        chartReady: chartReady,
        data: data
      }).then(function (ready) {
          var dt = new google.visualization.DataTable()
              dtBattery = new google.visualization.DataTable()

          dt.addColumn('date', 'Date')
          dt.addColumn('number', 'Speed (m/s)')
          dt.addColumn({type: 'string', role: 'tooltip', p:{html:true}})

          dtBattery.addColumn('date','Date')
          dtBattery.addColumn('number','Battery %')
          dtBattery.addColumn({type: 'string', role: 'tooltip', p:{html:true}})

          angular.forEach(ready.data, function(value, key) {
            var date = new Date(value.key[value.key.length - 1])

            dt.addRow([
              date,
              value.value.speed,
              tooltipTmpl({date:date, label:'Speed (m/s)', value:value.value.speed})
            ])
            dtBattery.addRow([
              date,
              value.value.battery*100,
              tooltipTmpl({date:date, label:'Battery %', value:value.value.battery*100})
            ])
          });

          return {
            speed: dt,
            battery: dtBattery
          }
      })
    }
  })
  .factory('FrequencyChartsData', function($q, chartReady, byValue){
    return function (data, tooltipTmpl, group_level, total) {
      return $q.all({
        chartReady:chartReady,
        data:data
      }).then(function (ready) {
        var dt = new google.visualization.DataTable()

        dt.addColumn('number', 'Speed (m/s)')
        dt.addColumn('number', '%')

        var d = {}

        angular.forEach(data, function(value, key) {
          d[value.key[group_level-1]]= (d[value.key[group_level-1]] || 0) + value.value
        });

        angular.forEach(Object.keys(d).map(parseFloat).sort(byValue), function(key){
          dt.addRow([parseFloat(key), parseInt(d[key])/total*100 ])
        });
        return dt
      })
    }
  })
  .constant('byValue', function byValue(a,b){
    return a-b
  })
  .constant('timeFilter', function timeFilter(dataFrequency, date){
    if(date){
      var d = new Date(date)
          ,filter = [new Date(d.getUTCFullYear(), d.getMonth(), 1)]

      for(var i=1; i<dataFrequency-1; i++){
        filter.push(new Date(date))
      }
      return filter
    }
    return []
  })
  .constant('frequencyTimeFilter', function frequencyTimeFilter (dataFrequency, date, val) {
      if(date){
        var d = new Date(date)
            ,filter = [new Date(d.getUTCFullYear(), d.getMonth(), 1),val]

        for(var i=1; i<dataFrequency-1; i++){
          filter.push(new Date(date))
          filter.push(val)
        }
        return filter
      }
      return []
    }
)
