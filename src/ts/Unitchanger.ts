import prettyms from 'pretty-ms';
export function ByteCal(bytes: number): string {
	
	var s = ["bytes", "KB", "MB", "GB", "TB", "PB", "ZB", "HB"];

	var e = Math.floor(Math.log(bytes) / Math.log(1024));

	if (e.toString() === "-Infinity") return "0 " + s[0];
	else return (bytes / Math.pow(1024, Math.floor(e))).toFixed(2) + " " + s[e];
}

export function Killo(number: number): string {
	
	let names = ["백", "천", "만", "백만", "억", "백억", "조", "백조", "경", "백경", "해"];
	
	let e = Math.floor(Math.log(number) / Math.log(100));
	// if (e >= 2) e = 1; 
	
	if (e.toString() === "-Infinity") return "0 " + names[0];
	else return (number / Math.pow(100, Math.floor(e))).toFixed(2) + "" + names[e];
}

export function Comma(number: any): string {
	number = number.toString();
	var tmp = number.split(".");
	number = tmp[0].split(/(?=(?:...)*$)/);
	number = number.join(",");
	if (tmp.length > 1) number = number +"."+ tmp[1];
	return number;
}

export function Milisecond(ms: number, compact?: boolean) {
	if (compact) {
		return prettyms(ms, {compact: true}).split(" ")[0];
	} else {
		return prettyms(ms, {compact: true});
	}
}