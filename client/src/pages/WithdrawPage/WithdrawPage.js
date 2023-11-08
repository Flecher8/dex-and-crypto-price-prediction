import React, { useEffect, useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { ethers } from "ethers";

import { tokenList } from "../../utils/tokenList";

import { getAbi } from "../../utils/getAbi";

const WithdrawPage = () => {
	const [selectedCoin, setSelectedCoin] = useState(tokenList[0].address); // Состояние для выбранной монеты
	const [depositAmount, setDepositAmount] = useState(0); // Состояние для количества монет
	const [balance, setBalance] = useState(0); // Пример баланса на контракте (замените на реальное значение)
	useEffect(() => {
		getBalanceOfTokenOnContract(selectedCoin);
	}, []);

	const handleCoinChange = event => {
		setSelectedCoin(event.target.value);
		getBalanceOfTokenOnContract(event.target.value);
	};

	async function getBalanceOfTokenOnContract(address) {
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
			setBalance(ethers.utils.formatEther(balance));
		} catch (error) {
			console.error("Error: ", error);
		}
	}

	const handleAmountChange = event => {
		setDepositAmount(parseInt(event.target.value));
	};

	const withdraw = async () => {
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
			const deposit = await ExchangeContract.withdrawToken(selectedCoin, depositAmount);
			console.log(deposit);
			alert(`Withdraw ${depositAmount}`);
		} catch (error) {
			console.error("Error: ", error);
		}
		console.log(`Withdraw ${depositAmount}`);
	};

	return (
		<div className="WithdrawPage">
			<Container>
				<h2>Withdraw</h2>
				<Form>
					<Form.Group>
						<Form.Label>Choose Cryptocurrency:</Form.Label>
						<Form.Control as="select" onChange={handleCoinChange}>
							{tokenList.map(token => (
								<option key={token.address} value={token.address}>
									{token.symbol}
								</option>
							))}
						</Form.Control>
					</Form.Group>
					{selectedCoin && (
						<>
							<Form.Group>
								<Form.Label>Balance on contract: {balance}</Form.Label>
							</Form.Group>
							<Form.Group>
								<Form.Label>Amount to deposit, wei:</Form.Label>
								<Form.Control
									type="number"
									placeholder="Enter amount"
									onChange={handleAmountChange}
									value={depositAmount}
									min="1"
								/>
							</Form.Group>
							<Button variant="primary" onClick={withdraw}>
								Send
							</Button>
						</>
					)}
				</Form>
			</Container>
		</div>
	);
};

export default WithdrawPage;
