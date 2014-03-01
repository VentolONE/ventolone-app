function intervalsKeys(doc) {
  var intervals = require('views/lib/params').intervals,
    keys = [],
    date;

  for (var i in intervals) {
    keys.push(new Date(parseInt(doc.t / intervals[i]) * intervals[i] * 1000))
  }
  date = keys[0]

  keys.unshift(date.getUTCFullYear()*100 + date.getMonth())
  return keys
}

function generateKeys(firstKey, doc) {
  return [firstKey].concat(intervalsKeys(doc))
}

exports.intervalsKeys = intervalsKeys
exports.generateKeys  = generateKeys