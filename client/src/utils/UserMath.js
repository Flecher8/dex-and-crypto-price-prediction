export function numberToHex(number) {
	console.log(number);
	try {
		number = parseInt(number);
	} catch (error) {
		console.log("Error:", error);
	}
	return number.toString(16);
}
