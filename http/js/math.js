/* ┌──────────────────────────────────────────────┐ */
/* │ Format Shift v0.1a                           │ */
/* ├──────────────────────────────────────────────┤ */
/* │ copyright © 30.11.2012 by Florian Wendelborn │ */
/* ├──────────────────────────────────────────────┤ */
/* │ licensed under the CC-BY license version 3.0 │ */
/* └──────────────────────────────────────────────┘ */

FormatShift = function () {
	this.convert = function (from, to, fromValue) {
		var result, a;
		switch (from) {
			case "dec":
				switch (to) {
					case "hour":
						// single variable conversion (!)
						result = "";
						if (Math.floor(fromValue) < 10) {
							result += 0;
						}
						result += Math.floor(fromValue); // hours
						result += ":";
						if (Math.floor((fromValue - Math.floor(fromValue)) * 60) < 10) {
							result += 0;
						}
						result += Math.floor((fromValue - Math.floor(fromValue)) * 60); // minutes
						result += ":";
						if (Math.floor((((fromValue - Math.floor(fromValue)) * 60) - (Math.floor((fromValue - Math.floor(fromValue)) * 60))) * 60) < 10) {
							result += 0;
						}
						result += Math.floor((((fromValue - Math.floor(fromValue)) * 60) - (Math.floor((fromValue - Math.floor(fromValue)) * 60))) * 60); // seconds
					break;
					default:
						console.error("JMath: Can't find convert [to]: " + to);
				}
			break;
			default:
				console.error("JMath: Can't find convert [from]: " + from);
		}
		return result;
	}
}