
$(document).ready(function(){
  //$('#vocab-terms-add-form').hide();
  
  $('#vocabularies').change(function(event){
    var vocabUri = $(this).val();
    $('#vocab-terms').html('here');
  });
  
  vocabTerms();
  vocabAddForm();
});

function vocabTerms() {
  // Vocabulary list
  var vocabClassesQuery =
    "PREFIX dc: <http://purl.org/dc/terms/>\n" +
    "SELECT \n" +
    "  ?vocabulary\n" +
    "FROM\n" +
    "  <" + currentGraph + ">\n" +
    "WHERE {\n" +
    "  ?vocabulary a dc:TypeScheme .\n" +
    "}";
  var sq = sparqlForReading.createQuery();
  sq.query( vocabClassesQuery, {
    success: function(results) {
      var vocabularies = results.results.bindings;
      for (vocabIdx in vocabularies) {
        var vocabulary = vocabularies[vocabIdx].vocabulary;
        $('<option>').html(vocabulary.value).appendTo('#vocabularies');
      }
      $('#vocabularies').trigger('change');
    },
    failure: function() { 
      alert('Retrieve failed'); 
    }
  });
}

function vocabAddForm() {
  // Vocabulary add form
  $('#vocab-class-name').attr('value', 'MyVocab');
  for (nsIndex in namespaces) {
    if (namespaces[nsIndex].type == 'custom') {
      var namespace = namespaces[nsIndex]; 
      $('<option>').html(namespace.prefix).appendTo('#vocab-prefix');
    }
    else {
      // Skip the namespace
    }
  }
  $('#currentRdfScope').html(currentRdfScope);
  $('#vocab-terms-uri').attr('value', 'vocab/myvocab/');
  $('#vocab-add-form-submit').click(function(event){
    event.preventDefault();
    vocabAddFormHandler();
  });
}

function vocabAddFormHandler() {
  // Prepare query
  var query = new SparqlQuery(currentGraph, resultLimit);
  query.command = 'insert';
  for (nsIndex in nsObjects) {
    var namespace = nsObjects[nsIndex];
    query.addNamespace(namespace);
  }
  
  // Describe vocabulary
  var vocabPrefix = $('#vocab-prefix').val();
  var vocabClassUri = vocabPrefix + $('#vocab-class-name').val();
  var vocabLabel = $('#vocab-label').val();
  //var vocabTermsUri = $('#vocab-terms-uri').val();
  query.addTriple(vocabClassUri, 'a', 'dcAbstractModel:VocabularyEncodingScheme');
  query.addTriple(vocabClassUri, 'a', 'dc:TypeScheme');
  //query.addTriple(vocabClassUri, 'rdfs:comment', 'Custom vocabulary');
  query.addTriple(vocabClassUri, 'rdfs:label', '"'+vocabLabel+'"@en-US');
  var today = new Date();
  var todayDateType = '"'+today.getFullYear()+'-'+ today.getMonth()+1 +'-'+today.getDate() + '"^^xsd:date';
  query.addTriple(vocabClassUri, 'dc:issued', todayDateType);
  
  var sq = sparqlForWriting.createQuery();
  sq.query( query.toString(), {
    success: function(resultsJson) {
      alert('Insert success'); 
    },
    failure: function() { 
      alert('Insert failed'); 
    }
  });
  
}

function getVocabClasses() {
}
