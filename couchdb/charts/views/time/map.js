function(doc) {
  emit(require('views/lib/utils').generateKeys(doc.anemometerId, doc), {
    speed: parseFloat(doc.speed),
    battery: parseFloat(doc.battery) / 423
  });
}
