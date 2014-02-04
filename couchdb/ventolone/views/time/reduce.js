function(keys, values, rereduce) {
  var battery = 0,
    speed = 0,
    len = values.length
  for (var i in values) {
    battery += values[i].battery
    speed += values[i].speed
  }
  return {
    speed: speed / len,
    battery: battery / len
  }
}
