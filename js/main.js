"use strict";

// Expose IMEManager
var IMEManager = {};
IMEManager.SuggestionEngines = {};

(function() {

    function DemoController() {
    }

    DemoController.prototype = {
	init: function demo_init() {

	    var self = this;

	    var glue = {
		path: "gaia/apps/keyboard/js/suggestion-engines/predictive_text",
		// XXX: no way to load suggestion engine with another language
		lang: 'en',
		sendCandidates: function(candidates) {
		    self.showCandidates(candidates);
		},
		sendPendingSymbols: function(symbols) {
		    self.showPendingSymbols(symbols);
		},
		sendKey: this.sendKey.bind(this),
		sendString: function(str) {
		    self.sendString(str);
		}
	    };

	    var spellchecker = IMEManager.SuggestionEngines['predictive_text'];
	    spellchecker.init(glue);

	    this.engine = spellchecker;

	    this.initUi();

	},

	initUi: function demo_initUi() {

	    var self = this;

	    this.mainInput = document.getElementById('main-input');
	    var userInput = this.userInput = document.getElementById('user-input');
	    var candidates = document.getElementById('word-suggestions');

	    this.mainInput.focus();
	    this.mainInput.value = "";

	    this.mainInput.onkeypress = function (event) {

		if (event.metaKey || event.ctrlKey || event.altKey)
		    return;

		// number keys: select selection
		if (event.charCode >= 49 && event.charCode <= 57) {
		    var n = event.charCode - 49;
		    $('#word-suggestions').find(':eq(' + n + ')').click();

		    event.preventDefault();
		    return;
		}

		if (event.keyCode == KeyEvent.DOM_VK_BACK_SPACE) {
		    self.deleteUserInput();
		    self.click(event.keyCode);
		    return;
		} else {
		    self.addUserInput(String.fromCharCode(event.charCode));
		    self.click(event.keyCode ? event.keyCode : event.charCode);
		}


		//event.preventDefault();
	    }

	    candidates.addEventListener('click', function (event) {
		var selectedWord = event.target;
		self.engine.select(selectedWord.textContent);
	    });

	},

	addUserInput: function demo_addUserInput(input) {
	    this.userInput.textContent += input;
	},
	deleteUserInput: function demo_addUserInput(input) {
	    var textContent = this.userInput.textContent;
	    this.userInput.textContent = textContent.substring(0, textContent.length - 1);
	},
	click: function demo_click(keyCode) {
	    this.engine.click(keyCode);
	},

	showCandidates: function demo_showCandidates(candidates) {
	    var wordSuggestions = document.getElementById('word-suggestions');

	    var element = $('#word-suggestions');
	    element.empty();

	    for (var i in candidates) {
		var li = document.createElement('li');
		li.textContent = candidates[i];
		wordSuggestions.appendChild(li);
	    }
	},
	sendKey: function demo_sendKey(charCode) {
	    switch (charCode) {
		case 8:
		    this.textAreaBackspace();
		    this.deleteUserInput();
		    break;

		default:
		    this.mainInput.value += String.fromCharCode(charCode);
		    break;
	    }
	},
	sendString: function demo_sendString(str) {
	    this.mainInput.value += str;
	},
	textAreaBackspace: function () {
	    var $t = $('#main-input');
	    var t = $t[0];
	    var selStart = t.selectionStart;
	    if (selStart === t.selectionEnd) {
		// remove one char before selStart
		t.value = t.value.substr(0, selStart - 1)
		+ t.value.substr(selStart, t.value.length);
		t.selectionStart = t.selectionEnd = selStart - 1;
	    } else {
		// remove selected substr
		t.value = t.value.substr(0, selStart)
		+ t.value.substr(t.selectionEnd, t.value.length);
		t.selectionStart = t.selectionEnd = selStart;
	    }
	}
    };

    window.onload = function() {
	var demoController = new DemoController();
	demoController.init();
    }
})();
