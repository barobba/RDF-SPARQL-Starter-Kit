/**
 * Sparql Result URI
 */
function SparqlResultUri(resultSet, resultIndex, varIndex) {

  // Member variables
  this.resultSet = resultSet;
  this.resultIndex = resultIndex;
  this.varIndex = varIndex;

  // Helper functions
  this.type = function() {
    return this.resultSet.results.bindings[this.resultIndex][this.varIndex]['type'];
  };
  
  this.value = function() {
    return this.resultSet.results.bindings[this.resultIndex][this.varIndex]['value'];
  };

  // Inspectors
  this.startsWith = function(uri) {
    if (this.value().startsWith(uri)) {
      return true;
    }
    else {
      return false;
    }
  };
  
  // Mutator
  this.addNamespace = function(prefix, uri) {
    this.resultSet.results.bindings[this.resultIndex][this.varIndex]['prefix'] = prefix;
    var localName = this.value().split(uri)[1];
    this.resultSet.results.bindings[this.resultIndex][this.varIndex]['localName'] = localName;
    this.resultSet.results.bindings[this.resultIndex][this.varIndex]['qualifiedName'] = prefix + localName;
  };
  
}
