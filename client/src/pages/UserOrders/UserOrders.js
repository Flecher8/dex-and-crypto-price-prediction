import React, { useEffect, useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { ethers } from "ethers";

import { tokenList } from "../../utils/tokenList";

import { getAbi } from "../../utils/getAbi";

const UserOrders = () => {
	useEffect(() => {}, []);

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
			const userOrders = await ExchangeContract.getUserOrders();
			console.log(userOrders);
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	return (
		<div className="UserOrders">
			<Container>
				<h2>User orders</h2>
				<Button variant="primary" onClick={getUserOrders}>
					Get user orders
				</Button>
			</Container>
		</div>
	);
};

export default UserOrders;
