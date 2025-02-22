import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./Footer.css";

const Footer = () => {
    return (
        <footer className="footer bg-dark text-white py-4">
            <Container>
                <Row className="text-center">
                    <Col md={4}>
                        <h5>About Us</h5>
                        <p>Seamless Healthcare with a Centralized Database System!.</p>
                    </Col>
                    <Col md={4}>
                        <h5>Contact Us</h5>
                        <p>Email: support@HMS.com</p>
                        <p>Phone: +123 456 7890</p>
                    </Col>
                </Row>
                <hr className="my-3 border-light" />
                <Row className="text-center">
                    <Col>
                        <p className="mb-0">&copy; 2025 Smart Health Management System | All Rights Reserved</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
