import React, { useState, useEffect } from 'react';
import { Table, Card, Badge, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getCampaigns } from '../api';

const CampaignList = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const res = await getCampaigns();
                setCampaigns(res.data.data);
            } catch (error) {
                console.error('Error fetching campaigns:', error);
                toast.error('Error loading campaigns. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, []);

    // Format the campaign rules for display
    const formatRules = (rules) => {
        if (!rules) return 'No rules defined';

        const fieldLabels = {
            totalSpend: 'Total Spend',
            visits: 'Number of Visits',
            lastActiveDate: 'Last Active Date',
        };

        const operatorLabels = {
            gt: '>',
            gte: '>=',
            lt: '<',
            lte: '<=',
            eq: '=',
            ne: '!=',
        };

        return Object.entries(rules).map(([field, operators]) => {
            return Object.entries(operators).map(([operator, value]) => {
                const fieldLabel = fieldLabels[field] || field;
                const operatorLabel = operatorLabels[operator] || operator;

                return `${fieldLabel} ${operatorLabel} ${value}`;
            }).join(', ');
        }).join(' AND ');
    };

    // Get badge color based on campaign status
    const getStatusBadge = (status) => {
        switch (status) {
            case 'COMPLETED':
                return <Badge bg="success">Completed</Badge>;
            case 'PROCESSING':
                return <Badge bg="primary">Processing</Badge>;
            case 'FAILED':
                return <Badge bg="danger">Failed</Badge>;
            case 'DRAFT':
                return <Badge bg="secondary">Draft</Badge>;
            default:
                return <Badge bg="info">{status}</Badge>;
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
                <h4 className="mb-0">Campaign History</h4>
            </Card.Header>
            <Card.Body>
                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" role="status" variant="primary">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                        <p className="mt-3">Loading campaigns...</p>
                    </div>
                ) : campaigns.length === 0 ? (
                    <div className="text-center py-5">
                        <p className="text-muted">No campaigns found. Create your first campaign!</p>
                    </div>
                ) : (
                    <Table striped hover responsive>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Rules</th>
                                <th>Audience Size</th>
                                <th>Status</th>
                                <th>Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {campaigns.map((campaign) => (
                                <tr key={campaign._id}>
                                    <td>{campaign.name}</td>
                                    <td>{formatRules(campaign.rules)}</td>
                                    <td>{campaign.audienceSize}</td>
                                    <td>{getStatusBadge(campaign.status)}</td>
                                    <td>{formatDate(campaign.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Card.Body>
        </Card>
    );
};

export default CampaignList; 