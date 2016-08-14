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
  quickTryWrapper.appendChild(toolbarDiv);

  var outputDiv = document.createElement('div');
  outputDiv.className = 'quicktry-output';
  quickTryWrapper.appendChild(outputDiv);

  var parent = prevDOM.parentNode;
  parent.replaceChild(quickTryWrapper, prevDOM);

  var aceEditor = ace.edit(editorDiv);
  aceEditor.setValue(code, 0);
}

function createEditButton(clickHandler) {
  var editButton = document.createElement('button');
  editButton.className = 'quicktry-edit-button';
  editButton.addEventListener('click', clickHandler, false);
  var imgURL = chrome.extension.getURL("edit.png");
  editButton.setAttribute("style", "background-image: url(" + imgURL +")");
  return editButton;
}

function showOutput(outputDiv, text) {
  outputDiv.setAttribute("style", "max-height: 200px;");
  outputDiv.innerHTML = text;
}

function hideOutput(outputDiv) {
  outputDiv.setAttribute("style", "max-height: 0px;");
}
