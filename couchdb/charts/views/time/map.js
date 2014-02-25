function(doc) {
  emit(require('views/lib/utils').generateKeys(doc.anemometerId, doc), {
    speed: parseFloat(doc.speed),
    battery: parseFloat(doc.battery) / require('views/lib/params').batteryMaxLevel
  });
}
