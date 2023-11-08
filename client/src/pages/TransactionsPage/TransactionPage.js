import React, { useEffect, useState } from "react";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import { ethers } from "ethers";

import { tokenList } from "../../utils/tokenList";
import { getAbi } from "../../utils/getAbi";
import { getAddressName } from "../../utils/getAddressName";

const TransactionPage = () => {
	const [formattedTransactions, setFormattedTransactions] = useState([]);
	useEffect(() => {
		async function fetchData() {
			await getTransactions();
		}
		fetchData();
	}, []);

	const getTransactions = async () => {
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
			const transactionsTemp = await ExchangeContract.getRecentTransactions(100);
			console.log(transactionsTemp);
			// After fetching user orders, format and display them
			const formattedTransactions = await Promise.all(
				transactionsTemp.map(async transaction => {
					return (
						<Card>
							<Card.Body>
								<Card.Text>From user: {transaction[0]}</Card.Text>
								<Card.Text>To user: {transaction[1]}</Card.Text>
								<Card.Text>From token: {getAddressName(transaction[2])}</Card.Text>
								<Card.Text>Amount: {ethers.utils.formatEther(transaction[3])}</Card.Text>
								<Card.Text>To token: {getAddressName(transaction[4])}</Card.Text>
								<Card.Text>Amount: {ethers.utils.formatEther(transaction[5])}</Card.Text>
							</Card.Body>
						</Card>
					);
				})
			);
			console.log(formattedTransactions);
			setFormattedTransactions(formattedTransactions); // Set the formatted orders here
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	return (
		<div className="TransactionPage">
			<Container>
				<h2>Transactions</h2>
				<div className="mt-3">{formattedTransactions}</div>
			</Container>
		</div>
	);
};

export default TransactionPage;
