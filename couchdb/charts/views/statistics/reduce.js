function(keys,values) {
  var res = values[0]
  for (var i = 1; i < values.length; i++) {
    res.speed.max = Math.max(values[i].speed.max, res.speed.max)
    res.speed.min = Math.min(values[i].speed.min, res.speed.min)
    res.speed.sum = values[i].speed.sum + res.speed.sum
    res.speed.cubicSum = values[i].speed.cubicSum + res.speed.cubicSum

    res.battery.max = Math.max(values[i].battery.max, res.battery.max)
    res.battery.min = Math.min(values[i].battery.min, res.battery.min)
    res.battery.sum = values[i].battery.sum + res.battery.sum

    res.time.max = Math.max(values[i].time.max, res.time.max)
    res.time.min = Math.min(values[i].time.min, res.time.min)

    res.count+=values[i].count
  }
  return res
}
