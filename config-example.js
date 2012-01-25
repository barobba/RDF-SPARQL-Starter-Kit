
resultLimit = 1000;

currentEndpoint = 'http://localhost/rdf-store/endpoint.php';
currentGraph = 'http://example.com/graphs/Graph1';
//currentKeyForReading = 'READ_KEY';   // passed as key=READ_KEY (used by some "ARC2" endpoints)
//currentKeyForWriting = 'WRITE_KEY';  // passed as key=WRITE_KEY (used by some "ARC2" endpoints)

namespaces = [{
  prefix: 'dc:',
  uri: 'http://purl.org/dc/elements/1.1/'
},{
  prefix: '_ex:',
  uri: 'http://example/'
},{
  prefix: 'ex:',
  uri: 'http://example/rdf/terms/'
}];
