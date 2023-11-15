import { Container, Row, Col, Button } from "react-bootstrap";

const MainPage = () => {
	return (
		<div className="MainPage">
			<div className="dex-app">
				<Container>
					<Row className="mt-5">
						<Col>
							<h1>Welcome to Our Decentralized Exchange (DEX) Platform!</h1>
							<p>Trade cryptocurrencies securely and efficiently with our advanced decentralized exchange.</p>
						</Col>
					</Row>

					<Row className="my-5">
						<Col md={6}>
							<h2>Decentralized Cryptocurrency Exchange</h2>
							<p>
								Our DEX provides a peer-to-peer trading platform that allows you to trade cryptocurrencies
								directly with other users without the need for intermediaries.
							</p>
							<Button variant="primary">Explore Exchange</Button>
						</Col>
						<Col md={6}>
							<img
								src="dex-exchange-image.jpg"
								alt="Decentralized Exchange"
								className="img-fluid"
								style={{ borderRadius: "10px" }}
							/>
						</Col>
					</Row>

					<Row className="my-5">
						<Col md={6}>
							<img
								src="machine-learning-image.jpg"
								alt="Machine Learning"
								className="img-fluid"
								style={{ borderRadius: "10px" }}
							/>
						</Col>
						<Col md={6}>
							<h2>Cryptocurrency Price Prediction</h2>
							<p>
								Utilize our advanced machine learning algorithms to predict cryptocurrency prices. Stay informed
								and make data-driven decisions.
							</p>
							<Button variant="primary">Explore Predictions</Button>
						</Col>
					</Row>

					<Row className="my-5">
						<Col>
							<h2>Why Choose Our DEX Platform?</h2>
							<ul>
								<li>Secure and transparent transactions</li>
								<li>Decentralized and censorship-resistant</li>
								<li>User-friendly interface</li>
								<li>Accurate cryptocurrency price predictions</li>
								<li>24/7 customer support</li>
							</ul>
						</Col>
					</Row>

					<Row className="my-5">
						<Col>
							<h2>Get Started Today!</h2>
							<p>
								Join our decentralized exchange platform and experience the future of cryptocurrency trading.
							</p>
							<Button variant="primary">Sign Up Now</Button>
						</Col>
					</Row>
				</Container>
			</div>
		</div>
	);
};

export default MainPage;
