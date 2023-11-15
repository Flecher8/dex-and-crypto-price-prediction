import React, { useEffect, useState } from "react";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import { ethers } from "ethers";

import { tokenList } from "../../utils/tokenList";

import { getAbi } from "../../utils/getAbi";

import { getAddressName } from "../../utils/getAddressName";

const UserOrders = () => {
	const [userOrders, setUserOrders] = useState([]);
	const [formattedOrders, setFormattedOrders] = useState([]);

	useEffect(() => {
		async function fetchData() {
			await getUserOrders();
		}
		fetchData();
	}, []);

	const getUserOrders = async () => {
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
			const userOrdersTemp = await ExchangeContract.getUserOrders();
			setUserOrders(userOrdersTemp);

			// After fetching user orders, format and display them
			const formattedOrders = await Promise.all(
				userOrdersTemp.map(async hash => {
					const order = await ExchangeContract.getOrderByHash(hash);
					return (
						<Card key={hash}>
							<Card.Body>
								<Card.Title>Order for Hash: {hash}</Card.Title>
								<Card.Text>From token: {getAddressName(order[1])}</Card.Text>
								<Card.Text>Amount: {ethers.utils.formatEther(order[2])}</Card.Text>
								<Card.Text>To token: {getAddressName(order[3])}</Card.Text>
								<Card.Text>Amount: {ethers.utils.formatEther(order[4])}</Card.Text>
							</Card.Body>
						</Card>
					);
				})
			);
			console.log(formattedOrders);
			setFormattedOrders(formattedOrders); // Set the formatted orders here
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	return (
		<div className="UserOrders">
			<Container>
				<h2>Your Orders</h2>
				<div className="mt-3">{formattedOrders}</div>
			</Container>
		</div>
	);
};

export default UserOrders;
