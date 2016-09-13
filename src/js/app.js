var $ =  window.$ = require('jquery');

var moment = require('moment');
require('moment-range');

var handlebars = require('handlebars');
require('./helpers/timeline-header');
require('./helpers/timeline-row');

handlebars.registerPartial('tooltip', require('html!./views/tooltip.html'));



$(document).ready(function() {
	init();
});

function init() {
	var data = loadURL(__PATH__);

	render(data);
	syncScroll();

	$('.container')
		.on('click', '.epic', function(e){
			showTooltip($(e.currentTarget).find('.tooltip'));
		});
}


function showTooltip(tooltip) {
	var tooltipClone = tooltip.clone();

	tooltipClone
		.appendTo('body')
		.show();

	tooltipClone
		.on('click', function(e) {
			if ($(e.target).closest('.tooltip-content').length) {
				return;
			}
			tooltipClone.remove();
		})
		.on('click', '.btn-close', function(e) {
			e.preventDefault();
			tooltipClone.remove();
		});
}

function render(data) {
	var template = handlebars.compile(require('html!./calendar.html'));

	data.MinDate = moment(data.MinDate).startOf('month').startOf('week').format("YYYY-MM-DD");
	data.MaxDate = moment(data.MaxDate).endOf('month').endOf('week').format("YYYY-MM-DD");

	var html = template(data);

	$('.container').html(html);
}


handlebars.registerHelper('state', function(is, val, opt) {
	if (opt.hash.equal) {
		is = (is === opt.hash.equal);
	}
	return (is ? val : '') + ' ';
});

function syncScroll() {
	var container = $('.container'),
		scrolableArea = container.find('.chart'),
		headerTable = container.find('.chart-table'),
		teamName = container.find('.name');

	var defaultLeftPosition = headerTable.offset().left;
	var currLeftPosition = headerTable.find('.current-month').offset().left - defaultLeftPosition;

	headerTable.css('margin-left', -currLeftPosition);
	teamName.css('left', currLeftPosition);
	scrolableArea.scrollLeft(currLeftPosition);

	scrolableArea.on('scroll', function() {
		headerTable.css('margin-left', -scrolableArea.scrollLeft());
		teamName.css('left', scrolableArea.scrollLeft());
	});
}

function loadURL(url) {
	var xhr = new XMLHttpRequest();

	xhr.open('GET', url, false);
	xhr.send(null);

	return JSON.parse(xhr.responseText);
}


