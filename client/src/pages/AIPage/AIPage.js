import React, { useEffect, useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import axios from "axios";

import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AIPage = () => {
	const [bitcoinHistory, seBitcoinHistory] = useState(null);
	const [chartData, setChartData] = useState(null);
	const [inputValue, setInputValue] = useState(1);

	const [predictionMinResponse, setPredictionMinResponse] = useState(null);
	const [predictionMaxResponse, setPredictionMaxResponse] = useState(null);

	const [predictionChartData, setPredictionChartData] = useState(null);

	const fetchHistory = async () => {
		try {
			const response = await axios.get("https://localhost:44361/Result/max_value_history");
			// Обработка данных, полученных в ответе
			console.log(response.data);
			seBitcoinHistory(response.data);
		} catch (error) {
			// Обработка ошибок
			console.error("Error fetching data:", error);
		}
	};

	useEffect(() => {
		fetchHistory();
	}, []);

	const fetchPrediction = async days => {
		try {
			const minResponse = await axios.get(`https://localhost:44361/Result/min_value?days=${days}`);
			const maxResponse = await axios.get(`https://localhost:44361/Result/max_value?days=${days}`);

			setPredictionMinResponse(minResponse.data);
			setPredictionMaxResponse(maxResponse.data);

			const labelsMain = minResponse.data.map(entry => entry.date);

			setPredictionChartData({
				labels: labelsMain,
				datasets: [
					{
						label: "High",
						data: maxResponse.data.map(entry => entry.high),
						backgroundColor: "rgba(0,0,255,0.2)",
						borderColor: "rgba(0,0,255,1)",
						yAxisID: "y"
					},
					{
						label: "Low",
						data: minResponse.data.map(entry => entry.low),
						backgroundColor: "rgba(255,0,0,0.2)",
						borderColor: "rgba(255,0,0,1)",
						yAxisID: "y"
					}
				]
			});

			// Handle the responses as needed, e.g., update state or perform further actions
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	useEffect(() => {
		if (bitcoinHistory) {
			const labelsMain = bitcoinHistory.map(entry => entry.date);

			setChartData({
				labels: labelsMain,
				datasets: [
					{
						label: "Bitcoin History Price",
						data: bitcoinHistory.map(entry => entry.high),
						backgroundColor: "rgba(0,255,0,0.2)",
						borderColor: "rgba(0,255,0,1)",
						yAxisID: "y"
					}
				]
			});
		}
	}, [bitcoinHistory]);

	const handleSubmit = event => {
		event.preventDefault();

		// Check if inputValue is a valid number greater than 1
		const days = parseInt(inputValue, 10);
		if (!isNaN(days) && days > 1) {
			fetchPrediction(days);
		} else {
			console.error("Invalid input. Please enter a number greater than 1.");
		}
	};

	return (
		<div className="AIPage">
			<Container>
				<h2>Prediction of bitcoin</h2>
				{chartData && chartData.labels ? (
					<Line
						data={chartData}
						options={{
							responsive: true,
							interaction: {
								mode: "index",
								intersect: false
							},
							stacked: false,
							plugins: {
								title: {
									display: true,
									text: "Bitcoin History Price"
								}
							},
							scales: {
								y: {
									type: "linear",
									display: true,
									position: "left"
								}
							}
						}}
					/>
				) : (
					<p>Loading...</p>
				)}

				{/* Form for user input */}
				<Form onSubmit={handleSubmit}>
					<Form.Group as={Row} className="mb-3">
						<Form.Label column sm="2">
							Enter Days:
						</Form.Label>
						<Col sm="4">
							<Form.Control
								type="number"
								placeholder="Enter number of days"
								value={inputValue}
								onChange={e => setInputValue(e.target.value)}
							/>
						</Col>
					</Form.Group>

					<Button type="submit">Submit</Button>
				</Form>

				{predictionChartData && predictionChartData.labels ? (
					<Line
						data={predictionChartData}
						options={{
							responsive: true,
							interaction: {
								mode: "index",
								intersect: false
							},
							stacked: false,
							plugins: {
								title: {
									display: true,
									text: "Prediction Bitcoin Price"
								}
							},
							scales: {
								y: {
									type: "linear",
									display: true,
									position: "left"
								}
							}
						}}
					/>
				) : null}
			</Container>
		</div>
	);
};

export default AIPage;
