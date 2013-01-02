/* ┌──────────────────────────────────────────────┐ */
/* │ Project Solar Client v0.1 Calendar Extension │ */
/* ├──────────────────────────────────────────────┤ */
/* │ copyright © 14.09.2012 by Florian Wendelborn │ */
/* ├──────────────────────────────────────────────┤ */
/* │ licensed under the CC-BY license version 3.0 │ */
/* └──────────────────────────────────────────────┘ */

CalendarIDs = new Object();
Calendar = function () {
	// Variable Area
	this.viewDate = [2012,new Date().getMonth(),false];
	this.elements = new Object();
	this.weekCounterActive = false;
	this.id = Math.round(Math.random()*123456789);
	CalendarIDs[this.id] = this;

	// Set Area
	this.setWeekCounter = function (boolean) {
		if (!boolean) {
			this.weekCounterActive = false;
		} else {
			this.weekCounterActive = true;
		}
	}
	this.setElement = function (element) {
		this.elements.main = element;
	}
	this.setViewDate = function (year, month, day) {
		this.viewDate = [year, month, day];
	}

	// View Control
	this.nextMonth = function () {
		if (this.viewDate[1] + 1 > 12) {
			this.viewDate[1] = 1;
			this.viewDate[0]++;
		} else {
			this.viewDate[1]++;
		}
		this.viewDate[2] = false;
	}
	this.previousMonth = function () {
		if (this.viewDate[1] - 1 < 1) {
			this.viewDate[1] = 12;
			this.viewDate[0]--;
		} else {
			this.viewDate[1]--;
		}
		this.viewDate[2] = false;
	}
	this.nextYear = function () {
		this.viewDate[0]++;
	}
	this.previousYear = function () {
		this.viewDate[0]--;
	}

	// DOM Area
	this.build = function () {
		// Creating Elements & Order
		this.elements.main;
		this.elements.control = document.createElement("div");
		this.elements.controlPreviousMonth = document.createElement("div");
		this.elements.controlNextMonth = document.createElement("div");
		this.elements.controlCurrentDate = document.createElement("div");
		this.elements.content = document.createElement("table");
		this.elements.weekdays = document.createElement("tr");
		this.elements.row1 = document.createElement("tr");
		this.elements.row2 = document.createElement("tr");
		this.elements.row3 = document.createElement("tr");
		this.elements.row4 = document.createElement("tr");
		this.elements.row5 = document.createElement("tr");
		this.elements.row6 = document.createElement("tr");

		this.elements.controlPreviousMonthImage = document.createElement("img");
		this.elements.controlNextMonthImage = document.createElement("img");
	
		// Appending Everything
		this.elements.main.appendChild(this.elements.control);
		this.elements.main.appendChild(this.elements.content);
		this.elements.content.appendChild(this.elements.weekdays);
		this.elements.content.appendChild(this.elements.row1);
		this.elements.content.appendChild(this.elements.row2);
		this.elements.content.appendChild(this.elements.row3);
		this.elements.content.appendChild(this.elements.row4);
		this.elements.content.appendChild(this.elements.row5);
		this.elements.content.appendChild(this.elements.row6);
		this.elements.control.appendChild(this.elements.controlPreviousMonth);
		this.elements.control.appendChild(this.elements.controlCurrentDate);
		this.elements.control.appendChild(this.elements.controlNextMonth);
		this.elements.controlPreviousMonth.appendChild(this.elements.controlPreviousMonthImage);
		this.elements.controlNextMonth.appendChild(this.elements.controlNextMonthImage);

		// Setting Up Images
		this.elements.controlPreviousMonthImage.src = "./png/icons/resultset_previous.png";
		this.elements.controlNextMonthImage.src = "./png/icons/resultset_next.png";

		// Control Panel
		this.elements.control.className = this.id;
		this.elements.controlPreviousMonth.onclick = function () {
			CalendarIDs[this.parentElement.className].previousMonth();
			CalendarIDs[this.parentElement.className].refresh();
		}
		this.elements.controlNextMonth.onclick = function () {
			CalendarIDs[this.parentElement.className].nextMonth();
			CalendarIDs[this.parentElement.className].refresh();
		}
		this.elements.controlCurrentDate.appendChild(document.createTextNode(""));

		// Weekdays
		for (var i = 0;i < 7; i++) {
			switch (i) {
				case 0:var d="Sun";break;
				case 1:var d="Mon";break;
				case 2:var d="Tue";break;
				case 3:var d="Wed";break;
				case 4:var d="Thu";break;
				case 5:var d="Fri";break;
				case 6:var d="Sat";break;
			}
			td = document.createElement("td");
			td.appendChild(document.createTextNode(d));
			this.elements.weekdays.appendChild(td);
			delete(td);
		}
		// Making it Fancy
		this.elements.main.className = "Calendar";
	}
	this.refresh = function () {
		// Cleaning Up
		this.elements.controlCurrentDate.removeChild(this.elements.controlCurrentDate.firstChild);
		this.elements.row1.innerHTML = "";
		this.elements.row2.innerHTML = "";
		this.elements.row3.innerHTML = "";
		this.elements.row4.innerHTML = "";
		this.elements.row5.innerHTML = "";
		this.elements.row6.innerHTML = "";

		// Filling In
		toMonth = ["January","February","March","April","May","June","July","August","September","October","November","December"];
		title = toMonth[this.viewDate[1]-1] + " " + this.viewDate[0];
		this.elements.controlCurrentDate.appendChild(document.createTextNode(title));

		// Day Amount Per Month
		switch (this.viewDate[1]) {
			case 1:a=31;break;
			case 2:
				if (this.viewDate[0] / 4 == Math.round(this.viewDate[0] / 4)) {
					a=29;
				} else {
					a=28;
				}
			break;
			case 3:a=31;break;
			case 4:a=30;break;
			case 5:a=31;break;
			case 6:a=30;break;
			case 7:a=31;break;
			case 8:a=31;break;
			case 9:a=30;break;
			case 10:a=31;break;
			case 11:a=30;break;
			case 12:a=31;break;
			default:
				console.error(this.viewDate[1]);
		}
		
		// Calculating Weekday Of The 1st Day Of The Current Month
		date = new Date();
		date.setFullYear(this.viewDate[0]);
		date.setMonth(this.viewDate[1]-1);
		date.setDate(1);
		
		shift = 0;
		week = 0;
		for (j = 1; j <= a; j++) {
			if (j == 1) {
				for (i = 0;i < date.getDay();i++) {
					td = document.createElement("td");
					this.elements.row1.appendChild(td);
					shift++;
				}
				shift++;
				td = document.createElement("td");
				td.appendChild(document.createTextNode(j));
			} else {
				td = document.createElement("td");
				td.appendChild(document.createTextNode(j));
				if (shift == 7) {
					week++;
					shift = 0;
				}
				shift++;
			}
			if (isData(this.viewDate[0], this.viewDate[1], j)) {
				td.className = "Calendar_Data";
				td.onclick = function (e) {
					useDay(e.toElement.innerHTML);
				}
			}
			switch (week) {
				case 0: this.elements.row1.appendChild(td);break;
				case 1: this.elements.row2.appendChild(td);break;
				case 2: this.elements.row3.appendChild(td);break;
				case 3: this.elements.row4.appendChild(td);break;
				case 4: this.elements.row5.appendChild(td);break;
				case 5: this.elements.row6.appendChild(td);break;
				default:
				console.error("Calendar: " + week);
			}
		}
	}
}