import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';

const Header = () => {
    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    Xeno CRM
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={NavLink} to="/" end>
                            Dashboard
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/campaigns">
                            Create Campaign
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/campaign-history">
                            Campaign History
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/customers">
                            Customers
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header; 