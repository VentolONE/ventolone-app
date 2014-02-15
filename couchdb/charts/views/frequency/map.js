function(doc) {
  if (doc.speed) {
    var value = parseInt(doc.speed / 0.5) * 0.5,
      keys = require('views/lib/utils').generateKeys(value, doc),
      date = keys[1];

    emit([
      doc.anemometerId,
      new Date(date.getUTCFullYear(), date.getMonth(), 1),
    ].concat(keys), 1)
  }
}
