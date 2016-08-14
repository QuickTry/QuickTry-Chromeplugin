// Unique ID for the className.
var MOUSE_VISITED_CLASSNAME = 'quicktry-visited';

// Previous dom, that we want to track, so we can remove the previous styling.
var prevDOM = null;
var questionID = null;
var answerID = null;
var codeSnipetIndex = 0;

// Mouse listener for any move event on the current document.
document.addEventListener('mousemove', function (e) {
  var srcElement = e.target;

  var button = createEditButton(changeToEditor);

  // Lets check if our underlying element is a DIV.
  if (srcElement.nodeName === 'PRE') {

    // For NPE checking, we check safely. We need to remove the class name
    // Since we will be styling the new one after.
    if (prevDOM !== null) {
      prevDOM.classList.remove(MOUSE_VISITED_CLASSNAME);
      prevDOM.removeChild(prevDOM.childNodes[0]);
    }

    // Add a visited class name to the element. So we can style it.
    srcElement.classList.add(MOUSE_VISITED_CLASSNAME);
    srcElement.style.position = "relative";
    srcElement.style.overflow = "visible";
    if(srcElement.firstChild.className !== "quicktry-edit-button") {
    	srcElement.insertBefore(button, srcElement.firstChild);
    }

    // The current element is now the previous. So we can remove the class
    // during the next iteration.
    prevDOM = srcElement;
  }
}, false);

function changeToEditor() {
  var code = reconstructSnippet(prevDOM.getElementsByTagName('code')[0]);

  var quickTryWrapper = document.createElement('div');
  quickTryWrapper.className = 'quicktry-wrapper';

  var editorDiv = document.createElement('div');
  editorDiv.className = 'quicktry-editor';
  quickTryWrapper.appendChild(editorDiv);

  var toolbarDiv = document.createElement('div');
  toolbarDiv.className = 'quicktry-toolbar';

  var runButton = document.createElement('button');
  runButton.className = 'quicktry-run';
  runButton.innerHTML = 'Run';
  toolbarDiv.appendChild(runButton);

  var languageSelector = document.createElement('select');
  toolbarDiv.appendChild(languageSelector);

  var langPython = document.createElement("option");
  langPython.text = 'Python2';
  languageSelector.add(langPython);

  var langPython = document.createElement("option");
  langPython.text = 'Python3';
  languageSelector.add(langPython);

  var langJavascript = document.createElement("option");
  langJavascript.text = 'Javascript';
  languageSelector.add(langJavascript);

  var langGo = document.createElement("option");
  langGo.text = 'Go';
  languageSelector.add(langGo);

  quickTryWrapper.appendChild(toolbarDiv);

  var outputDiv = document.createElement('div');
  outputDiv.className = 'quicktry-output';
  quickTryWrapper.appendChild(outputDiv);

  var parent = prevDOM.parentNode;
  parent.replaceChild(quickTryWrapper, prevDOM);

  var aceEditor = ace.edit(editorDiv);
  aceEditor.setValue(code, 0);

  ace.require("ace/ext/language_tools");
	aceEditor.setOptions({
    enableBasicAutocompletion: true
	});

  aceEditor.setTheme("ace/theme/github");
  var PythonMode = ace.require("ace/mode/python").Mode;
  aceEditor.session.setMode(new PythonMode());

  languageSelector.addEventListener("change", function() {
  	var selectedLanguage = languageSelector.value;
  	if(selectedLanguage === 'Python2' || selectedLanguage === 'Python3') {
  		var PythonMode = ace.require("ace/mode/python").Mode;
  		aceEditor.session.setMode(new PythonMode());
  	} else if(selectedLanguage === 'Javascript') {
  		var JavascriptMode = ace.require("ace/mode/javascript").Mode;
  		aceEditor.session.setMode(new JavascriptMode());
  	} else if(selectedLanguage === 'Go') {
  		var GoMode = ace.require("ace/mode/golang").Mode;
  		aceEditor.session.setMode(new GoMode());
  	}
  });

  runButton.addEventListener('click', function() {
    hideMessage(outputDiv);
    runCode(aceEditor.getValue(), languageSelector.value, '', function(output) {
      output = output.slice(1, -2);
      output = output.replace(/(?:(\\r\\n)|(\\r)|(\\n))/g, '<br />');
      showOutputMessage(outputDiv, output);
    }, function() {
      showErrorMessage(outputDiv, 'Something went wrong. That\'s all we know.');
    })
  });
}

function createEditButton(clickHandler) {
  var editButton = document.createElement('button');
  editButton.className = 'quicktry-edit-button';
  editButton.addEventListener('click', clickHandler, false);
  var imgURL = chrome.extension.getURL("edit.png");
  editButton.setAttribute("style", "background-image: url(" + imgURL +")");
  return editButton;
}

function showOutputMessage(outputDiv, text) {
  $(outputDiv).css('background-color', '#eff0f1').slideDown({duration: 200});
  outputDiv.innerHTML = text;
}

function showErrorMessage(outputDiv, text) {
  $(outputDiv).css('background-color', '#f5b3b3').slideDown({duration: 200});
  outputDiv.innerHTML = text;
}

function hideMessage(outputDiv) {
  $(outputDiv).slideUp({duration: 200});
}
