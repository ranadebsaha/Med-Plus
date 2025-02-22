import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Image, Card, Form } from "react-bootstrap";
import "./Landing.css";

export default function Landing() {
    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [department, setDepartment] = useState("");
    const navigate = useNavigate();

    const handleAppointmentSubmit = (e) => {
        e.preventDefault();
        alert(`Appointment booked for ${name} on ${date}`);
    };

    const handleContactSubmit = (e) => {
        e.preventDefault();
        alert(`Message sent by ${formData.name}`);
        setFormData({ name: "", email: "", message: "" });
    };

    const servicesData = [
        {
            title: "Live OPD Queue",
            description: "Track real-time queue status and estimated wait times.",
            icon: "🩺",
        },
        {
            title: "Bed Availability",
            description: "Instant updates on available beds and admission requests.",
            icon: "🛏️",
        },
        {
            title: "Medicine Tracking",
            description: "Automated inventory management for medicine and consumables.",
            icon: "💊",
        },
        {
            title: "Online Appointments",
            description: "Book your doctor’s visit online with ease.",
            icon: "📅",
        },
        {
            title: "Lab Reports",
            description: "Access your medical reports anytime, anywhere.",
            icon: "📑",
        },
        {
            title: "Emergency Support",
            description: "24/7 emergency response and ambulance services.",
            icon: "🚑",
        },
    ];

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    return (
        <div className="main-container">
            <header className="bg-light text-center py-5">
                <div className="container">
                    <h1 className="display-4 head-text">Efficient Hospital Management</h1>
                    <p className="lead">Real-time patient care, queue management, and inventory tracking <br /> <span className="small">Providing quality healthcare services with advanced technology.</span></p>
                    <button onClick={() => navigate("/appointment")} className="btn btn-primary btn-lg book-btn" >
                        Book an Appointment
                    </button>
                </div>
            </header>
            <section className="py-5 bg-light">
                <div className="container">
                    <h2 className="text-center mb-4 features-text">Key Features</h2>
                    <div className="row">
                        <div className="col-md-4 col-12 d-flex mb-4">
                            <div className="card text-center p-3 shadow key-card h-100 w-100">
                                <h5>Live OPD Queue</h5>
                                <p>Track real-time queue status and estimated wait times.</p>
                            </div>
                        </div>
                        <div className="col-md-4 col-12 d-flex mb-4">
                            <div className="card text-center p-3 shadow key-card h-100 w-100">
                                <h5>Bed Availability</h5>
                                <p>Instant updates on available beds and admission requests.</p>
                            </div>
                        </div>
                        <div className="col-md-4 col-12 d-flex mb-4">
                            <div className="card text-center p-3 shadow key-card h-100 w-100">
                                <h5>Medicine Tracking</h5>
                                <p>Automated inventory management for medicine and consumables.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section id="about" className="about-us py-5 bg-light">
                <Container>
                    <Row className="align-items-center">
                        <Col md={6} className="text-center mb-4 mb-md-0">
                            <Image src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2906&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Hospital" fluid rounded />
                        </Col>
                        <Col md={6}>
                            <h2 className="">About Our Hospital</h2>
                            <p className="about-p">
                                We are committed to providing <strong>top-quality healthcare services</strong> with advanced medical technology and a highly skilled team of professionals. Our goal is to ensure <strong>efficient patient care, real-time monitoring, and seamless hospital management</strong>.
                            </p>
                            <p className="about-p">
                                Our hospital is designed to cater to <strong>all medical needs</strong>, ensuring <strong>quick response, well-managed OPD, and an advanced inventory system</strong> to keep medicines and resources available at all times.
                            </p>
                            <Button variant="primary" size="lg" className="learn" onClick={() => navigate("/about-more")}>
                                Learn More
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </section>
            <section id="services" className="py-5 bg-light">
                <Container>
                    <h2 className="text-center mb-4">Our Services</h2>
                    <Row>
                        {servicesData.map((service, index) => (
                            <Col key={index} md={4} sm={6} className="mb-4 d-flex">
                                <Card className="text-center shadow key-card flex-fill">
                                    <Card.Body className="d-flex flex-column">
                                        <h2>{service.icon}</h2>
                                        <h5 className="fw-bold">{service.title}</h5>
                                        <p className="flex-grow-1">{service.description}</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>
            <div id="opd-appointment" className="bg-light w-100 py-5">
                <Container>
                    <h2 className="text-center mb-4">Book an OPD Appointment</h2>
                    <Row className="justify-content-center">
                        <Col md={6}>
                            <Form onSubmit={handleAppointmentSubmit} className="appointment-form p-4 shadow rounded bg-white">
                                <Form.Group className="mb-3">
                                    <Form.Label>Full Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} required />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Appointment Date</Form.Label>
                                    <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Department</Form.Label>
                                    <Form.Select value={department} onChange={(e) => setDepartment(e.target.value)} required >
                                        <option value="">Select Department</option>
                                        <option value="General OPD">General OPD</option>
                                        <option value="Cardiology">Cardiology</option>
                                        <option value="Orthopedics">Orthopedics</option>
                                        <option value="Dermatology">Dermatology</option>
                                    </Form.Select>
                                </Form.Group>
                                <Button variant="primary" size="lg" className="w-100 opt-btn" onClick={() => navigate("/")}>
                                    Book Appointment
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
            <div id="contact" className="contact-section bg-light py-5">
                <Container>
                    <h2 className="text-center mb-4">Contact Us</h2>
                    <Row className="justify-content-center">
                        <Col md={6}>
                            <Form onSubmit={handleContactSubmit} className="p-4 shadow bg-white rounded">
                                <Form.Group className="mb-3">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter your name" name="name" value={formData.name} onChange={handleChange} required />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" placeholder="Enter your email" name="email" value={formData.email} onChange={handleChange} required />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Message</Form.Label>
                                    <Form.Control as="textarea" rows={4} placeholder="Type your message" name="message" value={formData.message} onChange={handleChange} required />
                                </Form.Group>
                                <Button variant="primary" size="lg" type="submit" className="w-100 submit-btn">
                                    Send Message
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
}
