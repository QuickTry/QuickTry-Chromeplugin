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

function runCode(code, language, parameters, success, failure) {
  var url = "http://f98e2329.ngrok.io/run";
  var request = new XMLHttpRequest();

  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      if(request.status == 200) {
        var responseText = request.responseText;
        success(JSON.parse(responseText));
      } else {
        failure();
      }
    }
  };

  if ("withCredentials" in request) {
    // Check if the XMLHttpRequest object has a "withCredentials" property.
    // "withCredentials" only exists on XMLHTTPRequest2 objects.
    request.open("POST", url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // Otherwise, check if XDomainRequest.
    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
    request = new XDomainRequest();
    request.open("GET", url);
  }
  request.setRequestHeader('Content-Type', 'application/json');
  request.send(JSON.stringify({code: code, lang: language, params: parameters}));
}
