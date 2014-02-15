function intervalsKeys(doc) {
  var intervals = [3600 * 24, 3600 * 6, 3600, 1800, 600, 60],
    keys = [],
    date;

  for (var i in intervals) {
    keys.push(new Date(parseInt(doc.time / intervals[i]) * intervals[i] * 1000))
  }
  date = keys[0]

  keys.unshift(new Date(date.getUTCFullYear(), date.getMonth(), 1))
  return keys
}

function generateKeys(firstKey, doc) {
  return [firstKey].concat(intervalsKeys(doc))
}

exports.intervalsKeys = intervalsKeys
exports.generateKeys  = generateKeys