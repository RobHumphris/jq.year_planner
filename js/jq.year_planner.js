;(function ( $, window, document, undefined ) {
	"use strict";
	var pluginName = "yearPlanner", defaults = { propertyName: "value" };
	function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

	Plugin.prototype = {
		heading : null,
		today : new Date(),
		calendarDay : 0,
		startOfMonthFound : false,
		startOfMonthDay : 0,
		endOfMonthFound : false,
		endOfMonthDay : 0,
		dayNo : 0,
		registeredEvents : [],
        init: function() {
			$(".tooltip-target").ezpz_tooltip({ contentPosition: 'topLeft' });
			this.showCalendar();
        },
        showCalendar : function() {
			var z = "<h1 id='yearHeading' class='yearViewHeading'>";
			z += "Viewing Events for " + this.today.getFullYear();
			z += "</h1>";
			z += "<table id='exampleView' class='yearView'>";
			z += this.yearViewHeader();
			for (var i = 0; i <= 11; i++) { z += this.yearViewMonth(i); }
			z += "</tbody></table>";
			this.element.innerHTML = z;
		},
		yearViewHeader : function() {
			var z = "<thead><tr><th>&nbsp;</th>";
			for (var i = 0; i <= 36; i++) { z += "<th>" + Date.abbrDayNames[(i % 7)] + "</th>"; }
			return z + "</tr></thead><tbody>";
		},
		yearViewMonth : function(m) {
			this.calendarDay = new Date(this.today.getFullYear(), m, 1);
			this.startOfMonthDay = this.calendarDay.getDay()+1;
			this.endOfMonthDay = this.calendarDay.getDaysInMonth();
			this.startOfMonthFound = false;
			this.endOfMonthFound = false;
			var z = "<tr><td class='monthTag'>" + Date.abbrMonthNames[m] + "</td>";
			for (var i = 0; i <= 36; i++) {
				this.dayNo = (i - this.startOfMonthDay) + 2;
				z += this.yearViewDay(i, m);
			}
			return z + "</tr>";
		},
		getDayClass : function(d) {
			var z = (d % 2 == 0) ? "weekdayodd" : "weekday";
			if (this.dayNo > this.endOfMonthDay) { this.endOfMonthFound = true; }
			if (!this.startOfMonthFound) {
					if (d < this.startOfMonthDay - 1) z = "nonMonthDay";
					else this.startOfMonthFound = true;
			} else if (this.endOfMonthFound) z = "nonMonthDay";
			if (this.startOfMonthFound) { if (((d % 7) == 0) || (((d + 1) % 7) == 0)) { z = "weekend"; } }
			return z;
		},
		yearViewDay : function(i, m) {
			var z = "<td class='" + this.getDayClass(i) + "'";
			if ((this.startOfMonthFound) && (!this.endOfMonthFound)) { z += " id='D" + this.dayNo + "M" + m + "'>" + this.dayNo; }
			else { z += ">&nbsp"; }
			return z + "</td>";
		},
		getDatePosition : function(d, m) {
			return $("#D" + d + "M" + m).position();
		},
		addEvent : function(event) {
			if (event.length > 1) { this._doesEventWrapOverMonth(event); }
			else { this._renderEvent(event); }
			this.bindToolTips();
		},
		_renderEvent : function(event) {
			var pos = this.getDatePosition(event.day, event.month);
			var clashes = this._getNumOfClashes(event);
			pos.top = pos.top + clashes * 5;
			var id = event.day.toString()+ event.month.toString();
			var $calEvent = $("<div class='event tooltip-target' id='"+id+"-target-"+clashes+"' style='background-color:"+event.background+"; color:"+event.text+";' >" + event.caption + "</div>");
			var $calTip = $("<div class='tooltip-content' id='"+id+"-content-"+clashes+"' >"+event.note + "</div>");
			$calEvent.css({top: pos.top, left: pos.left, width: (event.length * 24) + "px" });
			this.registeredEvents.push({day:event.day, month:event.month, length:event.length});
			var v = $('#'+this.element.id);
			v.append($calEvent);
			v.append($calTip);
		},
		_doesEventWrapOverMonth : function(event) {
				var dtm = new Date(this.today.getFullYear(), event.month, event.day);
				var daysInThisMonth = dtm.getDaysInMonth();
				var daysLeft = event.day + event.length;
				if (daysLeft > daysInThisMonth) {
					var diff = (daysLeft - daysInThisMonth) - 1;
					this._renderEvent({day:event.day, month:event.month, length:event.length-diff, caption:event.caption, note:event.note, background:event.background, text:event.text});
					this._doesEventWrapOverMonth({day:1, month:event.month+1, length:diff, caption:event.caption, note:event.note, background:event.background, text:event.text});
				} else {
					this._renderEvent(event);
				}
		},
		_getNumOfClashes : function(event) {
			var numOfClashes = 0;
			var endDate = 0;
			for (var i = 0; i < this.registeredEvents.length; i++) {
				if (event.month == this.registeredEvents[i].month) {
					endDate = this.registeredEvents[i].day + this.registeredEvents[i].length;
					if ((event.day >= this.registeredEvents[i].day) && (event.day < endDate)) {
						numOfClashes++;
					}
				}
			}
			return numOfClashes;
		},
		addBankHoliday : function(date) {
			var pos = this.getDatePosition(date.day, date.month);
			var $calEvent = $("<div class='bankHoliday'>BH</div>");
			$calEvent.css({ top: pos.top, left: pos.left, width: "23px" });
			$('#'+this.element.id).append($calEvent);
		},
		bindToolTips : function() {
			$(".tooltip-target").ezpz_tooltip();
			$.fn.ezpz_tooltip.positions.topLeft = function(contentInfo, mouseX, mouseY, offset, targetInfo) {
				contentInfo['top'] = 0;
				contentInfo['left'] = 0;
				return contentInfo;
			};
		}
  };

  $.fn[pluginName] = function ( options, data ) {
  	return this.each(function () {
    	if (!$.data(this, "plugin_" + pluginName)) {
      	$.data(this, "plugin_" + pluginName,
        	new Plugin( this, options ));
      } else {
				$.data(this, "plugin_" + pluginName)[options](data)
			}
    });
	};
})( jQuery, window, document );
