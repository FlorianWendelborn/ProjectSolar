var crypto = require("crypto");

exports.md5 = function (string) {
	string = string + "";
	try {
		x = crypto.createHash('md5').update(string).digest("hex");
		return x;
	} catch (e) {
		console.log("cye#1 - " + e);
		return "";
	}
}