/* ┌──────────────────────────────────────────────┐ */
/* │ Project Solar Database Module v0.1           │ */
/* ├──────────────────────────────────────────────┤ */
/* │ Copyright © 14.09.2012 by Florian Wendelborn │ */
/* ├──────────────────────────────────────────────┤ */
/* │ Licensed under the CC-BY license             │ */
/* └──────────────────────────────────────────────┘ */

// variable declaration
var data, properties, nano, crypto;

// properties
properties = require("../../modules/properties/").getFromFileSync(__dirname + "/../properties.json");
require("../../modules/properties").watch(__dirname + "/../properties.json", function (p) {
	properties = p;
	nano = require('nano')(properties.database.url);
	data = nano.db.use(properties.database.solarData);
});

// require area
nano = require('nano')(properties.database.url);
crypto = require("./crypto.js");


// variable area
data = nano.db.use(properties.database.solarData);

exports.getList = function (callback) {
	data.list(function (err, body) {
		if(!err) {
			callback(false,body);	
		} else {
			callback(true,err);
		}
	});
}

exports.getData = function (id, callback) {
	data.get(id, function (err, body) {
		if(!err) {
			callback(false, body);
		} else {
			callback(err, false);
		}
	});
}