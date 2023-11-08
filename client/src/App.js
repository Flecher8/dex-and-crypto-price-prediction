import React, { useEffect, useState } from "react";
import "./App.css";
import Menu from "./components/Menu/Menu";
import DepositPage from "./pages/DepositPage/DepositPage";
import MainPage from "./pages/MainPage/MainPage";
import ErrorAlert from "./components/ErrorAlert/ErrorAlert";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ethers } from "ethers";

import { numberToHex } from "./utils/UserMath";
import WithdrawPage from "./pages/WithdrawPage/WithdrawPage";

function App() {
	const [showMetaMaskConnectionError, setShowMetaMaskConnectionError] = useState(false);
	const [showNetworkConnectionError, setShowNetworkConnectionError] = useState(false);

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
				setShowNetworkConnectionError(false);
			}
		} catch (error) {
			console.error("Error: ", error);
			setShowNetworkConnectionError(true);
		}
	}

	async function connectToMetamask() {
		try {
			if (window.ethereum === undefined) {
				console.error("EROR, windows under");
				setShowMetaMaskConnectionError(true);
			}
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const accounts = await provider.send("eth_requestAccounts", []);
			const walletAddress = accounts[0];
			setShowMetaMaskConnectionError(false);
		} catch (error) {
			console.error("Ошибка подключения к MetaMask:", error);
			setShowMetaMaskConnectionError(true);
		}
	}

	function renderRoutes() {
		if (showMetaMaskConnectionError && showNetworkConnectionError) {
			return (
				<ErrorAlert errorText="Both MetaMask and Network Connection Errors. Please check your MetaMask connection and switch to the correct network." />
			);
		} else if (showMetaMaskConnectionError) {
			return (
				<ErrorAlert errorText="Connection to MetaMask failed. Please make sure you have MetaMask installed and connected." />
			);
		} else if (showNetworkConnectionError) {
			return <ErrorAlert errorText="Network Connection Error. Please switch to the correct network." />;
		} else {
			return (
				<>
					<Routes>
						<Route path="/Main" element={<MainPage />} />
						<Route path="/Deposit" element={<DepositPage />} />
						<Route path="/Withdraw" element={<WithdrawPage />} />
						<Route path="/" element={<Navigate to="/Main" />} />
					</Routes>
				</>
			);
		}
	}

	return (
		<div className="App">
			{
				<BrowserRouter>
					<Menu />
					{renderRoutes()}
				</BrowserRouter>
			}
		</div>
	);
}

export default App;
