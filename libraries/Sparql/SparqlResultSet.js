//requires('String.prototype.startsWith');

/**
 * Sparql Result Set
 */
function SparqlResultSet(resultSet) {
  this.resultSet = resultSet;
}

/**
 * To Grid (JSON)
 */
SparqlResultSet.prototype.toGrid = function() {
  var grid = [];
  var bindings = this.resultSet.results.bindings;
  for (resultIndex in bindings) {
    var gridRow = {};
    var result = bindings[resultIndex];
    for (varName in result) {
      if ('qualifiedName' in result[varName]) {
        gridRow[varName] = result[varName]['qualifiedName'];
      }
      else {
        gridRow[varName] = result[varName]['value'];
      }
    }
    grid.push(gridRow);
  }
  return grid;
};

/**
 * To Matrix (JSON)
 */
SparqlResultSet.prototype.toMatrix = function() {  
};

/**
 * Add Namespace
 */
SparqlResultSet.prototype.addNamespace = function(prefix, uri) {

  var namespace = {'prefix': prefix, 'uri': uri};
  if (!this.resultSet.head.namespaces) {
    this.resultSet.head.namespaces = [];
  }
  this.resultSet.head.namespaces.push(namespace); 
  if (!this.resultSet.head.namespacesByPrefix) {
    this.resultSet.head.namespacesByPrefix = {};
  }
  this.resultSet.head.namespacesByPrefix[prefix] = namespace; 
  if (!this.resultSet.head.namespacesByUri) {
    this.resultSet.head.namespacesByUri = {};
  }
  this.resultSet.head.namespacesByUri[uri] = namespace; 

  var bindings = this.resultSet.results.bindings;
  for (resultIndex in bindings) {
    for (varIndex in bindings[resultIndex]) {
    
      if (bindings[resultIndex][varIndex]['type'] == 'uri') {
        var sVar = new SparqlResultUri(this.resultSet, resultIndex, varIndex);
        if (sVar.startsWith(uri)) {
          sVar.addNamespace(prefix, uri);
        }
      }
      
    }
  }
  
};
