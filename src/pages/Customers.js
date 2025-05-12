import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Card, Spinner, Button, Modal, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getCustomers, createOrder } from '../api';
import CustomerForm from '../components/CustomerForm';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [orderAmount, setOrderAmount] = useState('');
    const [creatingOrder, setCreatingOrder] = useState(false);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await getCustomers();
                setCustomers(res.data.data);
            } catch (error) {
                console.error('Error fetching customers:', error);
                toast.error('Error loading customers. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    const handleOpenOrderModal = (customer) => {
        setSelectedCustomer(customer);
        setShowOrderModal(true);
    };

    const handleCloseOrderModal = () => {
        setSelectedCustomer(null);
        setOrderAmount('');
        setShowOrderModal(false);
    };

    const handleCreateOrder = async () => {
        if (!selectedCustomer || !orderAmount || isNaN(parseFloat(orderAmount))) {
            toast.error('Please enter a valid order amount');
            return;
        }

        setCreatingOrder(true);
        try {
            await createOrder({
                customer: selectedCustomer._id,
                amount: parseFloat(orderAmount),
                orderDate: new Date()
            });

            toast.success('Order created successfully!');
            handleCloseOrderModal();

            // Refresh customer list to see updated stats
            const res = await getCustomers();
            setCustomers(res.data.data);
        } catch (error) {
            console.error('Error creating order:', error);
            toast.error('Error creating order. Please try again.');
        } finally {
            setCreatingOrder(false);
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div>
            <h1 className="mb-4">Customers</h1>

            <Row className="mb-5">
                <Col md={12}>
                    <CustomerForm />
                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-primary text-white">
                            <h4 className="mb-0">Customer List</h4>
                        </Card.Header>
                        <Card.Body>
                            {loading ? (
                                <div className="text-center py-5">
                                    <Spinner animation="border" role="status" variant="primary">
                                        <span className="visually-hidden">Loading...</span>
                                    </Spinner>
                                    <p className="mt-3">Loading customers...</p>
                                </div>
                            ) : customers.length === 0 ? (
                                <div className="text-center py-5">
                                    <p className="text-muted">No customers found. Add your first customer above!</p>
                                </div>
                            ) : (
                                <Table striped hover responsive>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Total Spend</th>
                                            <th>Visits</th>
                                            <th>Last Active</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customers.map((customer) => (
                                            <tr key={customer._id}>
                                                <td>{customer.name}</td>
                                                <td>{customer.email}</td>
                                                <td>${customer.totalSpend.toFixed(2)}</td>
                                                <td>{customer.visits}</td>
                                                <td>{formatDate(customer.lastActiveDate)}</td>
                                                <td>
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        onClick={() => handleOpenOrderModal(customer)}
                                                    >
                                                        Add Order
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Add Order Modal */}
            <Modal show={showOrderModal} onHide={handleCloseOrderModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Order for {selectedCustomer?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Order Amount ($)</Form.Label>
                            <Form.Control
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={orderAmount}
                                onChange={(e) => setOrderAmount(e.target.value)}
                                placeholder="Enter order amount"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseOrderModal}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleCreateOrder}
                        disabled={creatingOrder}
                    >
                        {creatingOrder ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="me-2"
                                />
                                Creating...
                            </>
                        ) : (
                            'Create Order'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Customers; 