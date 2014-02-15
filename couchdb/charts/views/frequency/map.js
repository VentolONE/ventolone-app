function(doc) {
  var value = parseInt(doc.speed / 0.5) * 0.5
  emit(require('views/lib/utils').generateKeys(doc.anemometerId, doc).concat(value), 1)
}
