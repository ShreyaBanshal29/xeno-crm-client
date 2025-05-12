import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { getCustomers, getCampaigns } from '../api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        customers: 0,
        campaigns: 0,
        avgSpend: 0,
        totalSpend: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Get customers
                const customerRes = await getCustomers();
                const customers = customerRes.data.data;

                // Get campaigns
                const campaignRes = await getCampaigns();
                const campaigns = campaignRes.data.data;

                // Calculate stats
                const totalSpend = customers.reduce((sum, customer) => sum + customer.totalSpend, 0);
                const avgSpend = customers.length > 0 ? totalSpend / customers.length : 0;

                setStats({
                    customers: customers.length,
                    campaigns: campaigns.length,
                    totalSpend: totalSpend.toFixed(2),
                    avgSpend: avgSpend.toFixed(2)
                });
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        {
            title: 'Total Customers',
            value: stats.customers,
            color: 'primary',
            icon: '👥'
        },
        {
            title: 'Total Campaigns',
            value: stats.campaigns,
            color: 'success',
            icon: '📢'
        },
        {
            title: 'Total Revenue',
            value: `$${stats.totalSpend}`,
            color: 'info',
            icon: '💰'
        },
        {
            title: 'Avg. Spend per Customer',
            value: `$${stats.avgSpend}`,
            color: 'warning',
            icon: '📊'
        }
    ];

    return (
        <div>
            <h1 className="mb-4">Dashboard</h1>

            <Row>
                {statCards.map((card, index) => (
                    <Col key={index} md={6} lg={3} className="mb-4">
                        <Card className={`border-${card.color} h-100 shadow-sm`}>
                            <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center p-4">
                                <div className="display-4 mb-2">{card.icon}</div>
                                <h5 className="text-muted mb-3">{card.title}</h5>
                                <h3 className={`text-${card.color}`}>
                                    {loading ? '...' : card.value}
                                </h3>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row className="mt-4">
                <Col md={12}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <h4 className="mb-4">Quick Actions</h4>
                            <Row>
                                <Col md={6} className="mb-3">
                                    <Card
                                        className="bg-light h-100 shadow-sm"
                                        role="button"
                                        onClick={() => window.location.href = '/campaigns'}
                                    >
                                        <Card.Body className="d-flex flex-column justify-content-center p-4">
                                            <h5>Create New Campaign</h5>
                                            <p className="text-muted mb-0">
                                                Use AI to target customers based on their behavior and spending patterns.
                                            </p>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <Card
                                        className="bg-light h-100 shadow-sm"
                                        role="button"
                                        onClick={() => window.location.href = '/customers'}
                                    >
                                        <Card.Body className="d-flex flex-column justify-content-center p-4">
                                            <h5>Manage Customers</h5>
                                            <p className="text-muted mb-0">
                                                Add new customers or view existing customer data.
                                            </p>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard; 