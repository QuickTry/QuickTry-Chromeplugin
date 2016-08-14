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
    codeSnipetIndex = getCodeSnipetIndex(srcElement.parentNode, srcElement);

    // The current element is now the previous. So we can remove the class
    // during the next iteration.
    prevDOM = srcElement;
  }
}, false);

function findAncestor (el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
}

function getCodeSnipetIndex(parentNode, childNode) {
	var count = 0;
	for(var i = 0; i < parentNode.childNodes.length; i++) {
		if(parentNode.childNodes[i].nodeName === "PRE") {
			if(parentNode.childNodes[i] === childNode) {
				return count;
			}
			count++;
		}

	}
}

function changeToEditor() {
  var code = fetchCode('answers', answerID, onCodeLoadSuccess, onCodeLoadFailure)
}

function onCodeLoadSuccess(code) {
  var txt = document.createElement("textarea");
  txt.innerHTML = code;
  code = txt.value;
  code = code.replace("/\r?\n/g", "\r\n")
  console.log(code);
  var editor = createEditor(prevDOM);
  var test = "Hello\nWorld";
  editor.value = "function parseHtmlEnteties(str) {\n    return str.replace(/&#([0-9]{1,3});/gi, function(match, numStr) {\n        var num = parseInt(numStr, 10); // read num as normal number\n        return String.fromCharCode(num);\n    });\n}\n";
}

function onCodeLoadFailure() {
  console.log('Loading the code failed.');
}
