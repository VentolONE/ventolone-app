function(doc) {
  if(parseFloat(doc.speed)){
    emit([doc.anemometerId], parseFloat(doc.speed));
  }
}