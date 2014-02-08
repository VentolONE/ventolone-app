function(doc) {
  if (doc.speed != 0) {
    var intervals = [3600 * 24, 3600 * 6, 3600, 1800, 600, 60]
    var value = parseInt(doc.speed / 0.5) * 0.5
    var keys = []

    for (var i in intervals) {
      keys.push(new Date(parseInt(doc.time / intervals[i]) * intervals[i] * 1000))
      keys.push(value)
    }
    var d = keys[0]

    emit([
      doc.plant.name,
      new Date(d.getUTCFullYear(),d.getMonth(), 1),
      value
    ].concat(keys), 1);
  }
}
