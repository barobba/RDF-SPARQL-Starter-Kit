
function SparqlQuery(graph, resultLimit) {
  
  this.graph = graph;

  if (resultLimit) {
    this.resultLimit = resultLimit;
  }
  else {
    this.resultLimit = 1000;
  }
  
  this.command = 'select';
  this.triples = [];
  this._queryString = '';
}

SparqlQuery.prototype.namespacesToString = function() {
  var namespacesString = '';
  if (this.namespaces) {
    for (nsIndex in this.namespaces) {
      namespace = this.namespaces[nsIndex];
      prefix = namespace['prefix'];
      uri = namespace['uri'];
      namespacesString += 'PREFIX ' + prefix + ' <' + uri + '> .\n';
    }
  }
  return namespacesString;
};

SparqlQuery.prototype.triplesToString = function() {
  var triplesString = '';
  var triples = this.triples;
  for (tIndex in triples) {
    var triple = triples[tIndex];
    triplesString += triple.subject + " " + triple.predicate + " " + triple.object + " .\n";
  }
  return triplesString;
};

SparqlQuery.prototype.toString = function() {
  
  queryString = '';
  
  // Add namespaces
  queryString += this.namespacesToString();
  
  // Prepare triples
  triplesString = this.triplesToString();

  // Statement
  switch (this.command) {
    case 'select':
      queryString += "SELECT \n"
                  +  "  *\n"
                  +  "WHERE {\n"
                  +  "  GRAPH ?graph {\n"
                  +  "    ?subject ?predicate ?object .\n"
                  +  "  }\n"
                  +  "}\n"
                  +  "LIMIT " + resultLimit;
      break;
    case 'insert':
      queryString += "INSERT INTO <"+this.graph+"> {\n"
                  +  "  " + triplesString
                  +  "}\n";
      break;
    case 'delete':
      queryString += "DELETE FROM <"+this.graph+"> {\n"
                  +  "  " + triplesString
                  +  "}\n";
      break;
    default:
      break;
  }
  
  // Values
  
  return queryString;
  
};

SparqlQuery.prototype.toSparql = function() {
};

SparqlQuery.prototype.addTriple = function(subject, predicate, object) {
  this.triples.push({
    'subject': subject, 
    'predicate': predicate, 
    'object': object
  });
};

SparqlQuery.prototype.addNamespace = function(namespace) {
  
  // Check input
  if (!namespace) {
    return;
  }
  
  
  // Namespaces  
  if (!this.namespaces) {
    this.namespaces = [];
  }
  this.namespaces.push(namespace); 
  
  // Namespaces by prefix
  if (!this.namespacesByPrefix) {
    this.namespacesByPrefix = {};
  }
  this.namespacesByPrefix[namespace.prefix] = namespace; 

  // Namespaces by URI  
  if (!this.namespacesByUri) {
    this.namespacesByUri = {};
  }
  this.namespacesByUri[namespace.uri] = namespace; 
  
};
