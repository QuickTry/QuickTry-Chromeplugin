// type might be 'answers' or 'questions'
function fetchCode(type, id, success, failure) {
  var url = 'https://api.stackexchange.com/2.2/' + type + '/' + id + '?site=stackoverflow&filter=withbody'
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      if (request.status == 200) {
        var responseText = request.responseText;
        var snippets = extractSnippets(responseText);
        success(snippets);
      } else {
        failure();
      }
    }
  };
  request.open("GET", url, true);
  request.send();
}

function extractSnippets(body) {
  var regexp = /<code>(.*?)<\/code>/ig
  var matches = [];
  var match;
  while(match = regexp.exec(body)) {
    matches.push(match[1]);
  }
  return matches;
}

function createEditor(element) {
  var textarea = document.createElement("textarea");
  textarea.className = 'quicktry-editor';
  var parent = element.parentNode;
  parent.replaceChild(textarea, element);
  return textarea;
}
