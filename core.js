$(document).ready(function() {
  $('pre').mouseenter(function() {

    var button = $('<button class="quicktry-edit-button">');
    button.css('background-image', 'url(' + chrome.extension.getURL("edit.png") +')');
    button.click(changeToEditor(this));

    $(this).css('position', 'relative').prepend(button);

  }).mouseleave(function() {
    $('.quicktry-edit-button', this).css('position', 'static').remove();
  });
});

function changeToEditor(element) {
  return function() {
    var code = reconstructSnippet(element.getElementsByTagName('code')[0]);

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

    var parent = element.parentNode;
    parent.replaceChild(quickTryWrapper, element);

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

    var output = new Output($(outputDiv));

    runButton.addEventListener('click', function() {
      output.hide();
      runCode(aceEditor.getValue(), languageSelector.value, '', function(response) {
        text = response.output.replace(/(?:(\\r\\n)|(\\r)|(\\n))/g, '<br />');
        if(response.status === 0) {
          output.info(text);
        } else if (response.status === 1) {
          output.warn(text);
        } else {
          output.error(text);
        }
      }, function() {
        output.error('Something went wrong. That\'s all we know.');
      })
    });
  }
}

var Output = function($element) {
  this.$element = $element;
}

Output.prototype.message = function(text, color) {
  this.$element.css('background-color', color)
    .html(text)
    .slideDown({duration: 200});
}

Output.prototype.info = function(text) {
  this.message(text, '#eff0f1');
}

Output.prototype.warn = function(text) {
  this.message(text, '#f0e59e');
}

Output.prototype.error = function(text) {
  this.message(text, '#f5b3b3');
}

Output.prototype.hide = function(text) {
  this.$element.slideUp({duration: 200});
}
