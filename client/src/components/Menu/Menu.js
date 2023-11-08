import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

const Menu = () => {
	return (
		<div className="menu">
			<Navbar expand="lg" className="bg-body-tertiary">
				<Container>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						<Nav className="me-auto">
							<Nav.Link href="/">Main</Nav.Link>
							<Nav.Link href="/Deposit">Deposit</Nav.Link>
							<Nav.Link href="/Withdraw">Withdraw</Nav.Link>
							<Nav.Link href="/Exchange">Exchange</Nav.Link>
							<Nav.Link href="/Transactions">Transactions</Nav.Link>
							<Nav.Link href="/UserOrders">Your Orders</Nav.Link>
							<Nav.Link href="/ActiveOrders">Active Orders</Nav.Link>
							<Nav.Link href="/AI">AI</Nav.Link>
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</div>
	);
};

export default Menu;
