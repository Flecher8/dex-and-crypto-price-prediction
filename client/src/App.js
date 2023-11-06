import React, { useEffect, useState } from "react";
import "./App.css";
import Menu from "./components/Menu/Menu";
import DepositPage from "./pages/DepositPage/DepositPage";
import MainPage from "./pages/MainPage/MainPage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ethers } from "ethers";

import { numberToHex } from "./utils/UserMath";

function App() {
	useEffect(() => {
		connectToMetamask().then(switchToMainNetwork());
	}, []);

	// Force page refreshes on network changes
	{
		// The "any" network will allow spontaneous network changes
		const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
		provider.on("network", (newNetwork, oldNetwork) => {
			// When a Provider makes its initial connection, it emits a "network"
			// event with a null oldNetwork along with the newNetwork. So, if the
			// oldNetwork exists, it represents a changing network
			if (oldNetwork) {
				window.location.reload();
			}
		});
	}

	async function switchToMainNetwork() {
		try {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const network = await provider.getNetwork();
			if (network.chainId !== process.env.REACT_APP_MAIN_NETWORK_ADDRESS) {
				await window.ethereum.request({
					method: "wallet_switchEthereumChain",
					params: [{ chainId: "0x" + numberToHex(process.env.REACT_APP_MAIN_NETWORK_ADDRESS) }]
				});
				// TODO Throw error if not
			}
		} catch (error) {
			console.error("Error: ", error);
		}
	}

	async function connectToMetamask() {
		try {
			if (window.ethereum === undefined) {
				console.error("EROR, windows under");
			}
			const provider = new ethers.providers.Web3Provider(window.ethereum);
		} catch (error) {
			// TODO Global error, user dont connect metamask
			console.error("Ошибка подключения к MetaMask:", error);
		}
	}

	return (
		<div className="App">
			<BrowserRouter>
				<Menu />
				<Routes>
					<Route path="/Main" element={<MainPage />} />
					<Route path="/Deposit" element={<DepositPage />} />
					{/* Default Router */}
					<Route path="/" element={<Navigate to="/Main" />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;

