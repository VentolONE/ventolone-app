function(doc) {
  if (doc.speed) {
    var value = parseInt(doc.speed / 0.5) * 0.5,
      intervalsKeys = require('views/lib/utils').intervalsKeys(doc),
      date = intervalsKeys[1],
      keys = [];

    for(var i in intervalsKeys){
      keys.push(intervalsKeys[i])
      keys.push(value)
    }

    emit([
      doc.anemometerId,
      new Date(date.getUTCFullYear(), date.getMonth(), 1),
      value
    ].concat(keys), 1)
  }
}
