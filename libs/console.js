var colors = require('./colors');

/*
	console.l	-> Log Time and Message
	console.i	-> Log Time and Information in color blue
	console.w	-> Log Time and Warning in color yellow
	console.e	-> Log Time and Error in color red
*/

function hms(){
	var d1 = pad(new Date().getHours()+"");
	var d2 = pad(new Date().getMinutes()+"");
	var d3 = pad(new Date().getSeconds()+"");
	var date = d1 + ":" + d2 + ":" + d3;	
	return date;
}

function pad(str){
	while(str.length<2){
		str = "0" + str;
	}
	return str;
}

exports.l = function(msg){
	console.log("[" + hms() + "] " + msg);
}
exports.e = function(msg){
	console.error("[" + hms()+ "] " + ("[Error] " + msg).red);
}
exports.i = function(msg){
	console.info("[" + hms() + "] " + ("[Info] " + msg).blue);
}
exports.w = function(msg){
	console.info("[" + hms() + "] " + ("[Warning] " + msg).yellow);
}