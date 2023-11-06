import "./App.css";
import Menu from "./components/Menu/Menu";
import DepositPage from "./pages/DepositPage/DepositPage";
import MainPage from "./pages/MainPage/MainPage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
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

