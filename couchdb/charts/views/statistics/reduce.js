function(keys,values) {
  var res = values[0]
  for (var i = 1; i < values.length; i++) {
    res.speed.max = Math.max(values[i].speed.max, res.speed.max)
    res.speed.min = Math.min(values[i].speed.min, res.speed.min)
    res.speed.sum = values[i].speed.sum + res.speed.sum
    res.speed.count+=values[i].speed.count

    res.time.max = Math.max(values[i].time.max, res.time.max)
    res.time.min = Math.min(values[i].time.min, res.time.min)
    res.time.sum = values[i].time.sum + res.time.sum
    res.time.count+=values[i].time.count

    res.battery.max = Math.max(values[i].battery.max, res.battery.max)
    res.battery.min = Math.min(values[i].battery.min, res.battery.min)
    res.battery.sum = values[i].battery.sum + res.battery.sum
    res.battery.count+=values[i].battery.count
  }
  return res
}
