function reconstructSnippet(codeElement) {
  var code = '';
  var parts = codeElement.children;
  for (var i = 0; i < parts.length; i++) {
  	code += parts[i].innerHTML;
  }
  var domParser = new DOMParser();
  var codeDocument = domParser.parseFromString(code, "text/html");
  return codeDocument.documentElement.textContent;
}

function createEditor(element) {
  var div = document.createElement("div");
  div.className = 'quicktry-editor';
  var parent = element.parentNode;
  parent.replaceChild(div, element);
  var editor = ace.edit(div);
  return editor;
}
