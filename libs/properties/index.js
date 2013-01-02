/* ┌──────────────────────────────────────────────┐ */
/* │ Properties version 0.1                       │ */
/* ├──────────────────────────────────────────────┤ */
/* │ Copyright © 20.11.2012 by Florian Wendelborn │ */
/* ├──────────────────────────────────────────────┤ */
/* │ Licensed under the CC-BY license             │ */
/* └──────────────────────────────────────────────┘ */

// variable declaration

var getFromFileSync;

var fs;

// require area

fs = require('fs');

// function area

exports.getFromFileSync = function (path) {
	return JSON.parse(fs.readFileSync(path));
}

exports.getFromFile = function (path, callback) {
	fs.readFile(path, function (err, data) {
		if (!err) {
			callback(false, JSON.parse(data));
		} else {
			callback(true, err);
		}
	});
}

exports.watch = function (path, callback) {
	fs.watchFile(path, function (err, data) {
		fs.readFile(path, function (err, data) {
			if (!err) {
				callback(JSON.parse(data));
			} else {
				console.error("properties: can't read file " + path);
			}
		});
	});
}