/* ┌──────────────────────────────────────────────┐ */
/* │ Project Solar Client v0.3a                   │ */
/* ├──────────────────────────────────────────────┤ */
/* │ copyright © 14.09.2012 by Florian Wendelborn │ */
/* ├──────────────────────────────────────────────┤ */
/* │ licensed under the CC-BY license version 3.0 │ */
/* └──────────────────────────────────────────────┘ */


// variable declaration


var isActiveValue, properties, time, minutes, graph, xAxis, yAxis, calendar, currentMode, update, system, ui, data, socket, currentMenu, menus, format, to15Minute, graphHoverDetail, graphShelving, graphLegend;


// variable area

to15Minute = ["00:00","00:15","00:30","00:45","01:00","01:15","01:30","01:45","02:00","02:15","02:30","02:45",
				"03:00","03:15","03:30","03:45","04:00","04:15","04:30","04:45","05:00","05:15","05:30","05:45",
				"06:00","06:15","06:30","06:45","07:00","07:15","07:30","07:45","08:00","08:15","08:30","08:45",
				"09:00","09:15","09:30","09:45","10:00","10:15","10:30","10:45","11:00","11:15","11:30","11:45",
				"12:00","12:15","12:30","12:45","13:00","13:15","13:30","13:45","14:00","14:15","14:30","14:45",
				"15:00","15:15","15:30","15:45","16:00","16:15","16:30","16:45","17:00","17:15","17:30","17:45",
				"18:00","18:15","18:30","18:45","19:00","19:15","19:30","19:45","20:00","20:15","20:30","20:45",
				"21:00","21:15","21:30","21:45","22:00","22:15","22:30","22:45","23:00","23:15","23:30","23:45",];

ui = new Object();
update = new Object();
data = new Object();

isActiveValue = {
	"module1Watt": true,
	"module2Watt": false,
	"module3Watt": false,
	"sensorSolarWatt": false
}

currentMenu = "";

function $ (id) {
	return document.getElementById(id);
}


// main area


window.onload = function () {
	format = new FormatShift();

	ui.list = $("list");
	ui.detailview = $("detailview");
	socket = io.connect("http://"+window.location.host+":8080/",{ reconnect: true });
	socket.on('connect', function () {
		system.on('connect');
	});
	socket.on('propertiesUpdate', function (data) {
		properties = data;
	});
	console.log("Successfull Init");
}
window.onresize = function () {
	if (currentData) {
		drawData();
	}
}

// system area


system = {
	error: function (id) {
		switch (id) {
			case 0:
				console.error("Can't find system.error.");
				break;
			case 1:
				console.error("Can't find system.event.");
				break;
			case 2:
				console.error("Can't find toolbarMenu.");
				break;
			case 3:
				console.error("Can't find toolbarMenu. (2)");
			default:
				system.error(0);
		}
	},
	on: function (type, arg) {
		switch (type) {
			case "connect":
				update.list();
				break;
			case "listclick":
				update.data(arg);
				break;
			default:
				system.error(1);
		}
	}
}


// update area


update = {
	list: function () {
		socket.emit("updateList", function (list) {
			data.list = list;
			var x = "";
			for(i = 0;i < list.total_rows;i++) {
				x += "<div onmousedown=\"system.on('listclick','"+list.rows[i].id+"');\">"+list.rows[i].id+"</div>";
			}
			ui.list.innerHTML = x;
			calendar = new Calendar();
			calendar.setElement($("chooseDayCalendar"));
			calendar.build();
			calendar.refresh();
			system.on('listclick', list.rows[0].id);
		});
	},
	data: function (id) {
		socket.emit("updateData", id, function (data) {
			day = id.split("-")[2];
			month = id.split("-")[1];
			if (day[0] == 0) {
				day = day[1];
			}
			if (month[0] == 0) {
				month = month[1];
			}
			if (day == "1") {
				day = "1st";
			} else if (day == "2") {
				day = "2nd";
			} else if (day == "3") {
				day = "3rd";
			} else {
				day = day + "th";
			}
			switch (month) {
				case "1": month ="January";break;
				case "2": month ="February";break;
				case "3": month ="March";break;
				case "4": month ="April";break;
				case "5": month ="May";break;
				case "6": month ="June";break;
				case "7": month ="July";break;
				case "8": month ="August";break;
				case "9": month ="September";break;
				case "10": month ="October";break;
				case "11": month ="November";break;
				case "12": month ="December";break;
			}
			$("detailview_heading").innerHTML = day;
			$("detailview_heading_month").innerHTML = month;
			$("detailview_heading_year").innerHTML = id.split("-")[0];
			currentData = data;
			drawData();
			updateGeneralInformation();
		});
	}
}


// function area

function isActive (mod) {
	return isActiveValue[mod];
}

function openDetailviewToolbar (element) {
	alert(element.id);
}

function useDay (day) {
	if (day < 10 && day[0] != "0")  {
		day = "0" + day;
	}
	month = calendar.viewDate[1];
	if (month < 10 && month[0] != "0") {
		month = "0" + month;
	}
	openToolbarMenu($("toolbar_choose"));
	system.on("listclick", calendar.viewDate[0] + "-" + month + "-" + day);
}

function isData (year, month, day) {
	if (day < 10 && day[0] != "0") {
		day = "0" + day;
	}
	if (month < 10 && month[0] != "0") {
		month = "0" + month;
	}
	for (i = 0; i < data.list.rows.length;i++) {
		if (data.list.rows[i].id == year + "-" + month + "-" + day) {
			return true;
		}
	}
	return false;
}

function updateMode (mod) {
	if (isActiveValue[mod]) {
		isActiveValue[mod] = false;
	} else {
		isActiveValue[mod] = true;
	}
	if (currentData) {
		drawData();
	}
} 

function updateGeneralInformation () {
	// update kwh produced
	var min1 = 0, min2 = 0, min3 = 0;
	var max1 = 0, max2 = 0, max3 = 0;
	var kwh1 = 0, kwh2 = 0, kwh3 = 0;
	for (var i in currentData) {
		if (currentData[i][7] != "" && i[2] == ":") {
			if (min1 == 0) {
				min1 = currentData[i][7];
			}
			if (min2 == 0) {
				min2 = currentData[i][23];
			}
			if (min3 == 0) {
				min3 = currentData[i][39];
			}
			if (currentData[i][7] > max1) {
				max1 = currentData[i][7];	
			}
			if (currentData[i][23] > max2) {
				max2 = currentData[i][23];	
			}
			if (currentData[i][39] > max3) {
				max3 = currentData[i][39];	
			}
		}
	}

	if (min1 && max1 != 0) {kwh1 = max1 - min1;}
	if (min2 && max2 != 0) {kwh2 = max2 - min2;}
	if (min3 && max3 != 0) {kwh3 = max3 - min3;}

	// console.log({"max1":max1,"max2":max2,"max3":max3,"min1":min1,"min2":min2,"min3":min3});
	$("generalKWHProduced").innerHTML = Math.round((kwh1 + kwh2 + kwh3)*100)/100;
	$("generalKWHProduced1").innerHTML = Math.round((kwh1)*100)/100;
	$("generalKWHProduced2").innerHTML = Math.round((kwh2)*100)/100;
	$("generalKWHProduced3").innerHTML = Math.round((kwh3)*100)/100;

	// update operation time
	var min1 = 0;
	var max1 = 0;
	var opt1 = 0;
	for (var i in currentData) {
		if (currentData[i][10] != "" && i[2] == ":") {
			if (min1 == 0) {
				min1 = currentData[i][10];
			}
			if (currentData[i][10] > max1) {
				max1 = currentData[i][10];	
			}
		}
	}

	if (min1 && max1 != 0) {opt1 = max1 - min1;}
	//Math.round((opt1)*100)/100
	$("generalOperationTime").innerHTML = format.convert("dec", "hour", opt1);
}

function drawData() {
	$("graph").innerHTML = "";

	// Rickshaw Start
	graph = new Rickshaw.Graph({
		element: document.getElementById("graph"),
		width: window.innerWidth,
		height: window.innerHeight - 320,
		renderer: "line",
		series: [{
			"color": "red",
			"data": [{"x":0,"y":0}]
		}]
	});
	// Rickshaw End

	var j, d, m, o, dataID;

	d = new Array();
	o = new Object();
	dataID = new Array();
	j = 0;

	var mod = ["module1", "module2", "module3", "sensorSolar"];
	var modWatt = [15, 31, 47, 2];
	for (var i = 0; i < 4; i++) {
		if (isActive(mod[i] + "Watt")) {
			dataID.push({"value": modWatt[i], "module": mod[i]});
		}
	}

	var moduleColor = {"module1": 0, "module2": 0, "module3": 0, "sensorSolar": 0};
	for (var h = 0; h < dataID.length; h++) {
		for (i in currentData) {
			if (currentData[i][50] != undefined) {
				if (isNaN(currentData[i][dataID[h].value])) {
					o.x = j * 900;
					o.y = "0";
				}
				else {
					o.x = j * 900;
					o.y = Math.round(currentData[i][dataID[h].value]);
				}
				d.push(o);
				j++;
				o = new Object();
			}
		}
		graph.series[h] = {
			"color": properties.graphColor[dataID[h].module][moduleColor[dataID[h].module]],
			"data": d,
			"name": "test"
		};
		moduleColor[dataID[h].module]++;
		j = 0;
		d = new Array();
	}
	// Rickshaw
	xAxis = new Rickshaw.Graph.Axis.Time({
		graph: graph
	});
	yAxis = new Rickshaw.Graph.Axis.Y({
		graph: graph
	});
	xAxis.render();
	yAxis.render();
	graphHoverDetail = new Rickshaw.Graph.HoverDetail({
		graph: graph,
		formatter: function(series, x, y) {
			return y + " watt";
		},
		xFormatter: function (x) {
			return to15Minute[x / 900];
		}
	});
	graph.render();
}


// Toolbar Area


function openToolbarMenu (element) {
	menu = $("toolbarMenu");
	if (menu.className == "" && currentMenu == element.id.split("_")[1]) {
		menu.className = "hidden";
		$("toolbar_" + currentMenu).className = "toolbarItem";
		$("toolbarMenu_" + currentMenu).className = "hidden";
		currentMenu = "";
	} else {
		if (currentMenu) {
			$("toolbar_" + currentMenu).className = "toolbarItem";
			$("toolbarMenu_" + currentMenu).className = "hidden";
		}
		currentMenu = element.id.split("_")[1];
		$("toolbar_" + currentMenu).className = "toolbarItem toolbarItemActive";
		menu.className = "";
		$("toolbarMenu_" + currentMenu).className = "";
	}
}

// Admin Function Area

function adminLogin () {
	socket.emit("adminLogin", $("adminLoginPassword").value, function (err, data) {
		if (!err) {
			// socket.emit("adminKillProcess");
			console.log(data);
		} else {
			console.log(err);
		}
	});
}