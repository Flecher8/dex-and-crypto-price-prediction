export function numberToHex(number) {
	try {
		number = parseInt(number);
	} catch (error) {
		console.log("Error:", error);
	}
	return number.toString(16);
}
