import React from "react";
import Alert from "react-bootstrap/Alert";

function ErrorAlert({ errorText }) {
	return <Alert variant="danger">{errorText}</Alert>;
}

export default ErrorAlert;
