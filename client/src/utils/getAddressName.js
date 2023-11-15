export function getAddressName(address) {
	if (address === process.env.REACT_APP_BTCT_ADDRESS) {
		return "BTCT";
	}
	if (address === process.env.REACT_APP_MTT_ADDRESS) {
		return "MTT";
	}

	if (address === process.env.REACT_APP_EXCHANGE_ADDRESS) {
		return "Main contract";
	}

	return null;
}
