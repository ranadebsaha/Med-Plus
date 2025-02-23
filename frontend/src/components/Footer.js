import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./Footer.css";

const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="footer bg-dark text-white py-4">
            <Container>
                
                    <div className="text-center" md={4}>
                        <h5 >About Us</h5>
                        <p>Seamless Healthcare with a Centralized Database System.</p>
                    </div>
                
                <hr className="my-3 border-light" />
                <Row className="text-center">
                    <Col>
                        <p className="mb-0">&copy; {currentYear} Health Management System | All Rights Reserved</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
