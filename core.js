var API_ENDPOINT = "http://f98e2329.ngrok.io/run";

ace.require("ace/ext/language_tools");

var PythonMode = ace.require("ace/mode/python").Mode;
var JavascriptMode = ace.require("ace/mode/javascript").Mode;
var GoMode = ace.require("ace/mode/golang").Mode;

$(document).ready(function() {
  $('pre').mouseenter(function() {
    var snippet = $(this);

    var button = $('<button class="quicktry-edit-button">');
    button.css('background-image', 'url(' + chrome.extension.getURL("edit.png") +')');
    button.click(function() {
      runQuickTry(snippet);
    });

    $(this).css('position', 'relative').prepend(button);

  }).mouseleave(function() {
    $(this).css('position', 'static');
    $('.quicktry-edit-button', this).remove();
  });
});

function runQuickTry(snippet) {
  var code = $('code', snippet).text();
  var quicktry = new QuickTry(code);
  quicktry.replaceElement(snippet);
  quicktry.onClose(function() {
    snippet.css('display', 'block');
    quicktry.destroy();
  });
}

var QuickTry = function(code) {
  this.$wrapper = $('<div class="quicktry-wrapper"></div>');
  this.$editor = $('<div class="quicktry-editor"></div>');
  this.$toolbar = $('<div class="quicktry-toolbar"></div>');
  this.$output = $('<div class="quicktry-output"></div>');

  this.$runButton = $('<button class="quicktry-run">Run</button>');
  this.$runButton.click(this.run.bind(this));

  this.$languageSelector = $('<select class="quicktry-languageselector"></select>');
  this.$closeButton = $('<button class="quicktry-close">Close</button>');

  this.$languageSelector.append($('<option>', {value: 'Python2', text: 'Python2'}));
  this.$languageSelector.append($('<option>', {value: 'Python3', text: 'Python3'}));
  this.$languageSelector.append($('<option>', {value: 'Javascript', text: 'Javascript'}));
  this.$languageSelector.append($('<option>', {value: 'Go', text: 'Go'}));
  this.$languageSelector.change(this.onSelectLanguage.bind(this))

  this.$toolbar.append(this.$runButton);
  this.$toolbar.append(this.$languageSelector);
  this.$toolbar.append(this.$closeButton);

  this.$wrapper.append(this.$editor);
  this.$wrapper.append(this.$toolbar);
  this.$wrapper.append(this.$output);

  this.ace = ace.edit(this.$editor[0]);
  this.ace.setValue(code, 0);
  this.ace.gotoLine(0, 0);
  this.ace.focus();
  this.ace.setTheme("ace/theme/github");
  this.ace.setOptions({
    enableBasicAutocompletion: true,
    minLines: 1,
    maxLines: 20
  });

  this.output = new Output(this.$output);
  this.runButton = new RunButton(this.$runButton);
}

QuickTry.prototype.replaceElement = function(element) {
  $(element).css('display', 'none');
  this.$wrapper.insertAfter(element);
}

QuickTry.prototype.onSelectLanguage = function() {
  switch(this.$languageSelector.val()) {
    case 'Python2': case 'Python3': this.ace.session.setMode(new PythonMode()); break;
    case 'Javascript': this.ace.session.setMode(new JavascriptMode()); break;
    case 'Go': this.ace.session.setMode(new GoMode()); break;
  }
}

QuickTry.prototype.run = function() {
  this.output.hide();
  this.runButton.disable();
  $.ajax({
    type: "POST",
    url: API_ENDPOINT,
    contentType : 'application/json',
    data: JSON.stringify({
      code: this.ace.getValue(),
      lang: this.$languageSelector.val(),
      params: ''
    }),
    success: this.onRunSuccess.bind(this),
    error: this.onRunFailure.bind(this)
  });
}

QuickTry.prototype.onRunSuccess = function(response) {
  text = response.output.replace(/(?:(\r\n)|(\r)|(\n))/g, '<br />');
  if(response.status == -1) {
    this.output.error(text);
  } else if (response.status == 1) {
    this.output.warn(text);
  } else {
    this.output.info(text);
  }
  this.runButton.enable();
}

QuickTry.prototype.onRunFailure = function() {
  output.error('Something went wrong. That\'s all we know.');
  this.runButton.enable();
}

QuickTry.prototype.onClose = function(handler) {
  this.$closeButton.click(handler);
}

QuickTry.prototype.destroy = function() {
  this.$wrapper.remove();
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
