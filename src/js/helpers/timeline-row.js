var moment = require('moment');
require('moment-range');
var handlebars = require('handlebars');
var TODAY = moment().endOf('day');

handlebars.registerHelper('timeline-row', function(minDate, maxDate, epics, invalid, opt) {
	if (invalid) {
		return opt.inverse(new EpicBar(minDate, maxDate, epics[0]));
	} 

	return opt.fn(new BodyLine(minDate, epics));
});


function BodyLine(minDate, epics) {
	this.row = [];

	epics.reduce(this.addBar.bind(this), minDate);
}

Object.assign(BodyLine.prototype, {
	addBar: function(start, epic) {
		var epicDueDate = moment(epic.DueDate);
		var epicStartDate = moment(epic.StartDate);

		if(start !== epic.StartDate) {
			this.row.push( new Bar(start, epicStartDate));
		}

		if(moment.range(epicDueDate, TODAY).diff('days') > 0) {
			epicDueDate = moment(TODAY);
		} 

		this.row.push(new EpicBar(epicStartDate, epicDueDate, epic))
		
		return epic.DueDate;
	}
});

function Bar(start, end) {
	this._start = moment(start || TODAY);
	this._end = moment(end || TODAY);
	this.isEmpty = true;

	Object.defineProperty(this, "width", {
		get: function() {
			return (this._getLength() * 4) + 'px';
		}
	});
}

Object.assign(Bar.prototype, {
	_getLength: function() {
		return moment.range(this._start, this._end).diff('days');
	}
});

function EpicBar(start, end, epicData) {
	Bar.call(this, start, end);

	this.epicKey = epicData.Key;
	this.epicName = epicData.Name;
	this.epicLink = epicData.Link;
	this.epicStatus = epicData.Status;
	this.epicSize = epicData.Size;
	this.epicPriority = epicData.Priority;
	this.epicAssignee = epicData.Assignee;
	this.epicProject = epicData.Project;
	this.epicImpediment = epicData.Impediment;

	this.isEmpty = false;
	this.phases = [];
	epicData.Phases.forEach(this.addPhase.bind(this));
}

Object.assign(EpicBar.prototype, Bar.prototype, {
	addPhase: function(phaseData) {
		this.phases.push( 
			new PhaseBar(
				phaseData.StartDate,
				phaseData.DueDate,
				phaseData.PhaseType,
				phaseData.IsProgrammaticallyEstimated,
				phaseData.ToBeContinued
			)
		);
	}
});


function PhaseBar(start, end, phaseType, IsProgrammaticallyEstimated, ToBeContinued) {
	Bar.call(this, start, end);

	this.phaseType = phaseType;
	this.IsProgrammaticallyEstimated = IsProgrammaticallyEstimated;
	this.ToBeContinued = ToBeContinued;
}

Object.assign(PhaseBar.prototype, Bar.prototype);
