function(doc) {
  emit(require('views/lib/utils').generateKeys(doc.a, doc), {
    speed: parseFloat(doc.s),
    battery: parseFloat(doc.b) / require('views/lib/params').batteryMaxLevel
  });
}
