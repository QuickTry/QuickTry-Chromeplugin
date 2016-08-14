// Unique ID for the className.
var MOUSE_VISITED_CLASSNAME = 'quicktry-visited';

// Previous dom, that we want to track, so we can remove the previous styling.
var prevDOM = null;
var questionID = null;
var answerID = null;

// Mouse listener for any move event on the current document.
document.addEventListener('mousemove', function (e) {
  var srcElement = e.target;

  var button = document.createElement('div');
  button.className = 'quicktry-edit-button';
  button.addEventListener('click', changeToEditor, false);
  //var imgURL = chrome.extension.getURL("edit.png");
  //console.log(imgURL);
  //button.style.setProperty("background-image", "url(" + imgURL +")", "important");

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
  console.log(code);
  var editor = createEditor(prevDOM);
  editor.setValue(code, 0);
}

