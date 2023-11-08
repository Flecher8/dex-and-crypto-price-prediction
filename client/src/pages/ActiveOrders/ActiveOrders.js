import React, { useEffect, useState } from "react";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import { ethers } from "ethers";

import { tokenList } from "../../utils/tokenList";

import { getAbi } from "../../utils/getAbi";

import { getAddressName } from "../../utils/getAddressName";

const ActiveOrders = () => {
	const [activeOrders, setActiveOrders] = useState([]);
	const [formattedOrders, setFormattedOrders] = useState([]);
	useEffect(() => {
		async function fetchData() {
			await getActiveOrders();
		}
		fetchData();
	}, []);

	const getActiveOrders = async () => {
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
			const activeOrdersTemp = await ExchangeContract.getActiveOrders();
			setActiveOrders(activeOrdersTemp);

			const formattedOrdersTemp = await Promise.all(
				activeOrdersTemp.map(async order => {
					return (
						<Card key={order[0]}>
							<Card.Body>
								<Card.Title>Order for Hash: {order[0]}</Card.Title>
								<Card.Text>They want token: {getAddressName(order[2])}</Card.Text>
								<Card.Text>They want Amount: {ethers.utils.formatEther(order[3])}</Card.Text>
								<Card.Text>You give token: {getAddressName(order[4])}</Card.Text>
								<Card.Text>You give Amount: {ethers.utils.formatEther(order[5])}</Card.Text>
							</Card.Body>
						</Card>
					);
				})
			);

			setFormattedOrders(formattedOrdersTemp);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const loadActiveOrder = async () => {
		try {
			const formattedOrdersTemp = await Promise.all(
				activeOrders.map(async order => {
					return (
						<Card key={order[0]}>
							<Card.Body>
								<Card.Title>Order for Hash: {order[0]}</Card.Title>
								<Card.Text>From token: {getAddressName(order[2])}</Card.Text>
								<Card.Text>Amount: {ethers.utils.formatEther(order[3])}</Card.Text>
								<Card.Text>To token: {getAddressName(order[4])}</Card.Text>
								<Card.Text>Amount: {ethers.utils.formatEther(order[5])}</Card.Text>
							</Card.Body>
						</Card>
					);
				})
			);
			console.log("F", formattedOrdersTemp);
			setFormattedOrders(formattedOrdersTemp);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	return (
		<div className="ActiveOrders">
			<Container>
				<h2>Active orders</h2>
				<div className="mt-3">{formattedOrders}</div>
			</Container>
		</div>
	);
};

export default ActiveOrders;
