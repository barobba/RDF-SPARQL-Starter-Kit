//Initialize "nsObjects" variable
nsObjects = [];
for (nsIndex in namespaces) {
  var nsArr = namespaces[nsIndex];
  var ns = new SparqlNamespace();
  ns.prefix = nsArr['prefix'];
  ns.uri = nsArr['uri'];
  nsObjects.push(ns);
}  

// Make sure resultLimit is set
if (!resultLimit) {
  resultLimit = 1000;
}

// Initialize SPARQL query engine
if (currentKeyForReading) {
  sparqlForReading = new SPARQL.Service(currentEndpoint + '?key=' + currentKeyForReading);
}
else {
  sparqlForReading = new SPARQL.Service(currentEndpoint);
}

if (currentKeyForWriting) {
  sparqlForWriting = new SPARQL.Service(currentEndpoint + '?key=' + currentKeyForWriting);
}
else {
  sparqlForWriting = new SPARQL.Service(currentEndpoint);
}
