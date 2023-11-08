import BTCTabi from "./BTCT.json";
import MTTabi from "./MTT.json";
import ExchangeAbi from "./Exchange.json";

export function getAbi(address) {
	if (address === process.env.REACT_APP_BTCT_ADDRESS) {
		return BTCTabi;
	}
	if (address === process.env.REACT_APP_MTT_ADDRESS) {
		return MTTabi;
	}

	if (address === process.env.REACT_APP_EXCHANGE_ADDRESS) {
		return ExchangeAbi;
	}

	return null;
}
