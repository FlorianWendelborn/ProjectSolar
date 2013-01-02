/* ┌──────────────────────────────────────────────┐ */
/* │ Project Solar Server v0.2                    │ */
/* ├──────────────────────────────────────────────┤ */
/* │ Copyright © 14.09.2012 by Florian Wendelborn │ */
/* ├──────────────────────────────────────────────┤ */
/* │ Licensed under the CC-BY license             │ */
/* └──────────────────────────────────────────────┘ */

// variable declaration
var adminLoggedIn, cmd, server, db, crypto, io, properties, dataCount, crypto;

// properties
properties = require("./libs/properties/").getFromFileSync(__dirname + "/properties.json");
require("./libs/properties/").watch(__dirname + "/properties.json", function (p) {
	properties = p;
	server.set("log level", properties.logLevel);
	if (properties.logPropertiesChange) {
		console.log("Properties changed on the fly.");
	}
});

// require area
crypto = require("../modules/crypto");
db = require("./libs/database.js");
crypto = require("./libs/crypto.js");
io = require("socket.io");

// variable area
dataCount = 0;

function updateTitle () {
	process.title = "ProjectSolar v0.2 [" + dataCount + " hits]";
}
updateTitle();

server = io.listen(properties.port).set("log level", properties.logLevel);
server.sockets.on("connection", function (socket) {
	socket.emit("propertiesUpdate", properties.client);
	socket.on("updateList", function (callback) {
		db.getList(function (err, list) {
			if(!err) {
				callback(list);
			}
		});
	});
	socket.on("updateData", function (id, callback) {
		db.getData(id, function (err, data) {
			if(!err) {
				dataCount++;
				updateTitle();
				callback(data);
			}
		});
	});
	socket.on("adminLogin", function (password, callback) {
		if (properties.admin.active) {
			if (crypto.md5(password) == properties.admin.password) {
				if (!adminLoggedIn || adminLoggedIn == socket) {
					callback(false, "welcome admin");
					adminLoggedIn = socket;
					socket.on("adminKillProcess", function () {
						console.log("ProjectSolar was killed by admin.");
						process.title = "R.I.P. ProjectSolar";
						process.exit(0);
					});
					if (properties.logAdminLoginSuccess) {
						console.error("Admin has logged in.");
					}
				} else {
					if (properties.logAdminLoginFail) {
						console.error("Admin failed to login, because the admin is already logged in.");
					}
					callback({"message": "admin already logged in"});
				}
			}
			else {
				if (properties.logAdminLoginFail) {
					console.error("Admin failed to login, because the password was wrong.");
				}
				callback({"message": "wrong password"});
			}
		} else {
			if (properties.logAdminLoginFail) {
				console.error("Admin failed to login, because the admin account was disabled.");
			}
			callback({"message": "admin account was disabled"});
		}
	});
	socket.on("disconnect", function () {
		if (adminLoggedIn == socket) {
			adminLoggedIn = false;
			if (properties.logAdminLogout) {
				console.error("Admin has logged out.");
			}
		}
		if (properties.showClientUpdates) {
			console.log("Current Clients: " + server.sockets.clients.length);
		}
	});
});