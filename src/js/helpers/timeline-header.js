var moment = require('moment');
require('moment-range');
var handlebars = require('handlebars');
var TODAY = moment().endOf('day');

handlebars.registerHelper('timeline-header', function(minDate, maxDate, opt) {
	var head = new HeaderRow(minDate, maxDate);

	return opt.fn(head);
});

function HeaderRow(minDate, maxDate) {
	console.log(arguments)
	this.cells = [];
	moment
		.range(
			moment(minDate),
			moment(maxDate)
		)
		.by('week', this.addCell.bind(this));
}

Object.assign(HeaderRow.prototype, {
	addCell: function(date) {
		this.cells.push(new HeaderCell(moment(date)));
	}
})

function HeaderCell(currDate) {
		console.log(currDate.day())
	this.week = currDate.isoWeek();
	this.monthName = currDate.format('MMMM');
	this.startOfMonth = !moment(currDate).isoWeek(this.week - 1).isSame(currDate, 'month');
	this.currentMonth = currDate.isSame(TODAY, 'month');
	this.currentWeek = currDate.isSame(TODAY, 'week');
	this.today = TODAY.day();
}
