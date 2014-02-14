function(doc) {
  emit(require('views/lib/utils').generateKeys(doc.anemometerId, doc), 1)
}
