import React, { useEffect, useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { ethers } from "ethers";

import { tokenList } from "../../utils/tokenList";

import { getAbi } from "../../utils/getAbi";

const ExchangePage = () => {
	const [selectedCoinFrom, setSelectedCoinFrom] = useState(tokenList[0].address);
	const [selectedCoinTo, setSelectedCoinTo] = useState(tokenList[0].address);

	const [balanceOfCoinFrom, setBalanceOfCoinFrom] = useState(0);

	const [amountFrom, setAmountFrom] = useState(0);
	const [amountTo, setAmountTo] = useState(0);

	const handleCoinChangeFrom = event => {
		setSelectedCoinFrom(event.target.value);
		getBalanceOfTokenOnContract(event.target.value, setBalanceOfCoinFrom);
	};

	const handleCoinChangeTo = event => {
		setSelectedCoinTo(event.target.value);
	};

	const handleAmountChangeFrom = event => {
		setAmountFrom(parseInt(event.target.value));
	};

	const handleAmountChangeTo = event => {
		setAmountTo(parseInt(event.target.value));
	};

	async function getBalanceOfTokenOnContract(address, set) {
		try {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const accounts = await provider.send("eth_requestAccounts", []);
			const walletAddress = accounts[0]; // first account in MetaMask
			const signer = provider.getSigner(walletAddress);

			const ExchangeContract = new ethers.Contract(
				process.env.REACT_APP_EXCHANGE_ADDRESS,
				getAbi(process.env.REACT_APP_EXCHANGE_ADDRESS),
				signer
			);
			const balance = await ExchangeContract.balanceOf(address, walletAddress);
			set(ethers.utils.formatEther(balance));
		} catch (error) {
			console.error("Error: ", error);
		}
	}

	useEffect(() => {
		getBalanceOfTokenOnContract(selectedCoinFrom, setBalanceOfCoinFrom);
	}, []);

	const checkExchangeParams = () => {
		if (selectedCoinFrom === selectedCoinTo) {
			alert("Coin from and coin to can't be the same!");
			throw new Error("Coin from and coin to can't be the same!");
		}
		if (amountFrom <= 0 || amountTo <= 0) {
			alert("Amount can't be <= 0!");
			throw new Error("Amount can't be <= 0!");
		}
	};

	const exchange = async () => {
		try {
			checkExchangeParams();

			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const accounts = await provider.send("eth_requestAccounts", []);
			const walletAddress = accounts[0]; // first account in MetaMask
			const signer = provider.getSigner(walletAddress);

			const ExchangeContract = new ethers.Contract(
				process.env.REACT_APP_EXCHANGE_ADDRESS,
				getAbi(process.env.REACT_APP_EXCHANGE_ADDRESS),
				signer
			);
			const timespan = Math.floor(Date.now() / 1000);
			const trade = await ExchangeContract.trade(selectedCoinFrom, amountFrom, selectedCoinTo, amountTo, timespan);
			console.log(trade);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	return (
		<div className="ExchangePage">
			<Container>
				<h2>Exchange</h2>
				<h5 className="mt-5">Create an order to exchange cryptocurrency</h5>
				<Form className="flex align-items-center">
					<Form.Group as={Row} className="flex align-items-center mt-5">
						<Form.Label>You pay:</Form.Label>
						<Form.Control as="select" onChange={handleCoinChangeFrom}>
							{tokenList.map(token => (
								<option key={token.address} value={token.address}>
									{token.symbol}
								</option>
							))}
						</Form.Control>
						<Form.Control
							type="number"
							placeholder="Enter amount"
							onChange={handleAmountChangeFrom}
							value={amountFrom}
							min="1"
						/>
						<Form.Label>You current balance on contract: {balanceOfCoinFrom}</Form.Label>
					</Form.Group>
					<Form.Group as={Row} className="flex align-items-center mt-5">
						<Form.Label>You get:</Form.Label>
						<Form.Control as="select" onChange={handleCoinChangeTo}>
							{tokenList.map(token => (
								<option key={token.address} value={token.address}>
									{token.symbol}
								</option>
							))}
						</Form.Control>
						<Form.Control
							type="number"
							placeholder="Enter amount"
							onChange={handleAmountChangeTo}
							value={amountTo}
							min="1"
						/>
					</Form.Group>
					<Button variant="primary" onClick={exchange} className="mt-5">
						Send
					</Button>
				</Form>
			</Container>
		</div>
	);
};

export default ExchangePage;
