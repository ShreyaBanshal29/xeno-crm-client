import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
    return (
        <footer className="bg-dark text-light py-4 mt-auto">
            <Container className="text-center">
                <p className="mb-0">
                    &copy; {new Date().getFullYear()} Xeno CRM. All rights reserved.
                </p>
            </Container>
        </footer>
    );
};

export default Footer; 