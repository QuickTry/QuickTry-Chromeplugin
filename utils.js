var API_ENDPOINT = "http://f98e2329.ngrok.io/run";

function reconstructSnippet(codeElement) {
  var code = '';
  var parts = codeElement.children;
  for (var i = 0; i < parts.length; i++) {
    code += parts[i].innerHTML;
  }
  return $('<div/>').html(code).text();
}

function createEditor(element) {
  var div = document.createElement("div");
  div.className = 'quicktry-editor';
  var parent = element.parentNode;
  parent.replaceChild(div, element);
  var editor = ace.edit(div);
  return editor;
}

function runCode(code, language, parameters, success, failure) {
  $.ajax({
    type: "POST",
    url: API_ENDPOINT,
    contentType : 'application/json',
    data: JSON.stringify({
      code: code,
      lang: language,
      params: parameters
    }),
    success: success,
    error: failure
  });
}
