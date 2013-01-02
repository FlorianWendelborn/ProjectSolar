/* ┌──────────────────────────────────────────────┐ */
/* │ CSV Parser for ProjectSolar v0.2             │ */
/* ├──────────────────────────────────────────────┤ */
/* │ copyright © 26.09.2012 by Florian Wendelborn │ */
/* ├──────────────────────────────────────────────┤ */
/* │ licensed under the CC-BY license version 3.0 │ */
/* └──────────────────────────────────────────────┘ */

// variable declaration
var csv, fs, nano, database, db, properties, system;

// properties
properties = require("./libs/properties/").getFromFileSync(__dirname + "/properties.json");

// require area
csv = require("./libs/mycsv.js");
fs = require("fs");
nano = require("nano")(properties.database.url);

// Variable Area
database = nano.use(properties.database.solarData);

db = new Object();
	db.updateDay;

system = new Object();
	system.error;
	system.readFolder;
	system.parseFiles = new Array();
	system.parseFile;
	system.foldersToRead = 0;

// System Area
system.error = function (id,err) {
	e = false;
	switch (id) {
		case 0:e="uncaughtException";break;
		case 1:e="Can't find system.error";break;
		case 2:e="Error while reading Folder";break;
		default:system.error(1,{"id":id});
	}
	if (err) {
		for (i in err) {
			e += "["+i+":"+err[i]+"]";
		}
	}
	if (e) {
		console.error("\033[41m[system error "+ id + "]\033[49m - " + e);
		delete(e);
	}
}

system.readFolder = function (folder) {
	fs.readdir(folder, function (err,files) {
		if(!err){
			if(typeof(finished) == "undefined"){finished = 1;}
			for(i in files){
				if(files[i].indexOf(".") == -1){
					system.foldersToRead++;
					system.readFolder(folder + files[i] + "/");
				}
				else{
					system.parseFiles.push(folder + files[i]);
				}
			}
			system.foldersToRead--;
			if (system.foldersToRead == -1) {
				system.parseFile();
			}
		} else {
			system.error(0, {"err":err});
		}
	});
}
system.parseFile = function () {
	x = new Object();
	for (var i = 0;i < system.parseFiles.length;i++) {
		day = system.parseFiles[i].split("/")[3].split(".")[0].split("(")[0];
		if (!x[day]) {
			x[day] = new Object();
		}
		content = fs.readFileSync(system.parseFiles[i],"utf-8");
		csv.toMap(content, function (err, data) {
			if (!err) {
				for (j = 6;j < data.length;j++) {
					x[day][data[j][0]] = data[j];
				}
			}
		});
		console.log("Mapped #" + i + " - " + system.parseFiles[i]);
	}
	for (i in x) {
		db.updateDay(i, x[i]);
	}
}
db.updateDay = function (day, data) {
	database.get(day, function (err, body) {
		if(!err) {
			database.destroy(body._rev, function (err, body) {
				if (!err) {
					console.log(body);
					database.insert(day, data, function (err, body) {
						if (err) {
							console.error(err.message);
							return;
						}
						console.log("Inserted");
						console.log(body);
					});
				} else {
					console.error("DataBaseError #1 " + err.message);	
				}
			});
		} else {
			console.log("Trying to insert " + day + " with some data");
			database.insert(data, day, function (err, body) {
				if (err) {
					console.error("err: " + err.message);
					return;
				}
				console.log("Inserted");
				console.log(body);
			});
		}
	});
}

// Run Area
system.readFolder(properties.dataPath);