import React, { useState } from 'react';
import { Form, Button, Card, Spinner, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { createCustomer } from '../api';

const CustomerForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        visits: 0,
        totalSpend: 0,
        lastActiveDate: new Date().toISOString().split('T')[0]
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const value = e.target.type === 'number'
            ? parseFloat(e.target.value)
            : e.target.value;

        setFormData({
            ...formData,
            [e.target.name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email) {
            toast.error('Please fill all required fields');
            return;
        }

        setLoading(true);
        try {
            await createCustomer(formData);
            toast.success('Customer added successfully!');

            // Reset form
            setFormData({
                name: '',
                email: '',
                visits: 0,
                totalSpend: 0,
                lastActiveDate: new Date().toISOString().split('T')[0]
            });
        } catch (error) {
            console.error('Error adding customer:', error);
            toast.error(
                error.response?.data?.error ||
                'Error adding customer. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
                <h4 className="mb-0">Add New Customer</h4>
            </Card.Header>
            <Card.Body>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Name <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter customer name"
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter customer email"
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Total Spend ($)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="totalSpend"
                                    value={formData.totalSpend}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Number of Visits</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="visits"
                                    value={formData.visits}
                                    onChange={handleChange}
                                    min="0"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Last Active Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="lastActiveDate"
                                    value={formData.lastActiveDate}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Button
                        variant="primary"
                        type="submit"
                        disabled={loading}
                        className="mt-3"
                    >
                        {loading ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="me-2"
                                />
                                Adding Customer...
                            </>
                        ) : (
                            'Add Customer'
                        )}
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default CustomerForm; 