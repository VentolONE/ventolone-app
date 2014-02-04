function(doc) {
  var intervals = [3600 * 24, 3600 * 6, 3600, 1800, 600, 60]
  var keys = []

  for (var i in intervals) {
    keys.push(new Date(parseInt(doc.time / intervals[i]) * intervals[i] * 1000))
  }
  var d = keys[0]

  emit([
  doc.plant.name,
  new Date(d.getUTCFullYear(), d.getMonth(), 1)
].concat(keys), {
    speed: parseFloat(doc.speed),
    battery: parseFloat(doc.battery) / 423
  });
}
