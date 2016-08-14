ace.require("ace/ext/language_tools");

var PythonMode = ace.require("ace/mode/python").Mode;
var JavascriptMode = ace.require("ace/mode/javascript").Mode;
var GoMode = ace.require("ace/mode/golang").Mode;

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

    var quickTryWrapper = $('<div class="quicktry-wrapper"></div>');
    var editorDiv = $('<div class="quicktry-editor"></div>');
    var toolbarDiv = $('<div class="quicktry-toolbar"></div>');
    var outputDiv = $('<div class="quicktry-output"></div>');

    var runButton = $('<button class="quicktry-run">Run</button>');
    var languageSelector = $('<select class="quicktry-languageselector"></select>');

    languageSelector.append($('<option>', {value: 'Python2', text: 'Python2'}));
    languageSelector.append($('<option>', {value: 'Python3', text: 'Python3'}));
    languageSelector.append($('<option>', {value: 'Javascript', text: 'Javascript'}));
    languageSelector.append($('<option>', {value: 'Go', text: 'Go'}));

    toolbarDiv.append(runButton);
    toolbarDiv.append(languageSelector);

    quickTryWrapper.append(editorDiv);
    quickTryWrapper.append(toolbarDiv);
    quickTryWrapper.append(outputDiv);

    $(element).replaceWith(quickTryWrapper);

    var aceEditor = ace.edit(editorDiv[0]);
    aceEditor.setValue(code, 0);
    aceEditor.gotoLine(0, 0);
    aceEditor.focus();
    aceEditor.setTheme("ace/theme/github");
    aceEditor.setOptions({
      enableBasicAutocompletion: true
    });

    languageSelector.change(function() {
      switch(this.value) {
        case 'Python2': case 'Python3': aceEditor.session.setMode(new PythonMode()); break;
        case 'Javascript': aceEditor.session.setMode(new JavascriptMode()); break;
        case 'Go': aceEditor.session.setMode(new GoMode()); break;
      }
    });

    var output = new Output($(outputDiv));
    var run = new RunButton($(runButton));

    run.click(function() {
      output.hide();
      run.disable();

      runCode(aceEditor.getValue(), languageSelector.val(), '', function(response) {
        text = response.output.replace(/(?:(\\r\\n)|(\\r)|(\\n))/g, '<br />');
        if(response.status == -1) {
          output.error(text);
        } else if (response.status == 1) {
          output.warn(text);
        } else {
          output.info(text);
        }
        run.enable();
      }, function() {
        output.error('Something went wrong. That\'s all we know.');
        run.enable();
      });
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

var RunButton = function($button, output) {
  this.$button = $button;
}

RunButton.prototype.enable = function() {
  this.$button.html('Run');
  this.$button.css('background-image', 'none');
  this.$button.prop('disabled', false);
}

RunButton.prototype.disable = function() {
  this.$button.html('');
  this.$button.css('background-image', 'url(' + chrome.extension.getURL("spin.gif") +')');
  this.$button.prop('disabled', true);
}

RunButton.prototype.click = function(handler) {
  this.$button.click(handler);
}
