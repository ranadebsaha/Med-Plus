import React from "react";
import './MyNavbar.css';
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";

const MyNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const scrollToSection = (sectionId) => {
        if (location.pathname !== "/") {
            navigate("/");
            setTimeout(() => {
                scrollToTarget(sectionId);
            }, 100);
        } else {
            scrollToTarget(sectionId);
        }
    };

    const scrollToTarget = (sectionId) => {
        if (sectionId === "home") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            const element = document.getElementById(sectionId);
            if (element) {
                window.scrollTo({
                    top: element.offsetTop - 70,
                    behavior: "smooth"
                });
            }
        }
    };

    return (
        <Navbar variant="light" expand="lg" className="nav fixed-top">
            <Container>
                <Navbar.Brand as={Link} to="/">Hospital</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" className="menu" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto menu-options">
                        <Nav.Link onClick={() => scrollToSection("home")}>Home</Nav.Link>
                        <Nav.Link onClick={() => scrollToSection("about")}>About Us</Nav.Link>
                        <Nav.Link onClick={() => scrollToSection("services")}>Services</Nav.Link>
                        <Nav.Link onClick={() => scrollToSection("opd-appointment")}>OPD Appointment</Nav.Link>
                        <Nav.Link onClick={() => scrollToSection("contact")}>Contact Us</Nav.Link>
                    </Nav>
                    <div className="d-flex gap-2 account">
                        <Button variant="outline-dark" onClick={() => navigate("/login")}>
                            Patient Login
                        </Button>
                        <Button variant="outline-dark" onClick={() => navigate("/admin/login")}>
                            Admin/Staff Login
                        </Button>
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default MyNavbar;
