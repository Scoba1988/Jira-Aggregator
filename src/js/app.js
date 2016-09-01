var $ = require('jquery');
var moment = require('moment');
var handlebars = require('handlebars');

$(document).ready(function() {
	init();
});

function init() {
	var dataArray = loadURL(__PATH__);
}

function loadURL(url) {
	var xhr = new XMLHttpRequest();

	xhr.open('GET', url, false);
	xhr.send(null);

	return JSON.parse(xhr.responseText);
}