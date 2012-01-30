
resultLimit = 1000;

currentEndpoint = 'http://localhost/rdf-store/endpoint.php';
//currentKeyForReading = 'READ_KEY';   // passed as key=READ_KEY (used by some "ARC2" endpoints)
//currentKeyForWriting = 'WRITE_KEY';  // passed as key=WRITE_KEY (used by some "ARC2" endpoints)
//currentUuidProvider = 'http://URI/THAT/RETURNS/A/RANDOM/STRING';

currentRdfScope = 'http://example.com/rdf/';
currentGraph = currentRdfScope + 'graphs/graph1';


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
