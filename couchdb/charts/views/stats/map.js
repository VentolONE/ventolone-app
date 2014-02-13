function(doc) {
  if(doc.speed){
    emit([doc.anemometerId], parseFloat(doc.speed));
  }
}