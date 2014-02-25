function(doc) {
  var batteryMaxLevel = require('views/lib/params').batteryMaxLevel
  emit(require('views/lib/utils').generateKeys(doc.anemometerId, doc), {
    speed: {
      max: parseFloat(doc.speed),
      min: parseFloat(doc.speed),
      sum: parseFloat(doc.speed)
    },
    time: {
      max: parseFloat(doc.time),
      min: parseFloat(doc.time),
      sum: parseFloat(doc.time)
    },
    battery: {
      max: parseFloat(doc.battery / batteryMaxLevel),
      min: parseFloat(doc.battery / batteryMaxLevel),
      sum: parseFloat(doc.battery / batteryMaxLevel)
    },
    count: 1
  });
}
