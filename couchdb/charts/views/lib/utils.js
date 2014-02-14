exports.generateKeys = function generateKeys(firstKey, doc) {
  var intervals = [3600 * 24, 3600 * 6, 3600, 1800, 600, 60]
  var keys = []

  for (var i in intervals) {
    keys.push(new Date(parseInt(doc.time / intervals[i]) * intervals[i] * 1000))
  }
  var d = keys[0]

  return [
    firstKey,
    new Date(d.getUTCFullYear(), d.getMonth(), 1)
  ].concat(keys)
}
