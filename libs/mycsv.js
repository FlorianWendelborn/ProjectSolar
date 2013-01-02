// CSV to Javascript Map Parser
// and Javascript Map to CSV Parser v0.1
// Written by Florian Wendelborn since 26.09.2012 16:15

exports.toMap = function (data, callback) {
	map = new Array();
	data = data.split("\n");
	for(i = 0;i < data.length;i++) {
		map[i] = data[i].split(";");
		for (j = 0;j < map[i].length;j++) {
			map[i][j] = map[i][j].replace(/,/g, ".");
		}
	}
	callback(false, map);
}
exports.toCSV = function (data, callback) {
	csv = "";
	for (i = 0;i < data.length;i++) {
		for (j = 0;j < data[i].length; j++) {
			csv += data[i][j] + ";";
		}
		csv += "\n";
	}
	callback(false, csv);
}
// exports.toCSV([["test","tested","xD"],["b","t","w"]], function (err, data) {
// 	if (!err) {
// 		console.log(JSON.stringify(data));
// 	}
// });