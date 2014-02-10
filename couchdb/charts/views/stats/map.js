function(doc) {
  if(doc.speed){
    emit([doc.turbineId], parseFloat(doc.speed));
  }
}