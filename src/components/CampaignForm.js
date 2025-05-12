import React, { useState } from 'react';
import { Form, Button, Card, Spinner, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { generateRules, previewAudience, createCampaign } from '../api';

const CampaignForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        promptText: '',
    });
    const [rules, setRules] = useState(null);
    const [audienceSize, setAudienceSize] = useState(null);
    const [loading, setLoading] = useState({
        generate: false,
        preview: false,
        create: false,
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRuleChange = (field, operator, value) => {
        setRules({
            ...rules,
            [field]: {
                ...rules[field],
                [operator]: parseFloat(value),
            },
        });
    };

    const handleGenerateRules = async (e) => {
        e.preventDefault();
        if (!formData.promptText) {
            toast.error('Please enter a prompt');
            return;
        }

        setLoading({ ...loading, generate: true });
        try {
            const res = await generateRules(formData.promptText);
            setRules(res.data.rules);
            toast.success('Rules generated successfully!');
        } catch (error) {
            console.error('Error generating rules:', error);
            toast.error('Error generating rules. Please try again.');
        } finally {
            setLoading({ ...loading, generate: false });
        }
    };

    const handlePreviewAudience = async () => {
        if (!rules) {
            toast.error('Please generate rules first');
            return;
        }

        setLoading({ ...loading, preview: true });
        try {
            const res = await previewAudience(rules);
            setAudienceSize(res.data.audienceSize);
            toast.info(`Campaign will target ${res.data.audienceSize} customers`);
        } catch (error) {
            console.error('Error previewing audience:', error);
            toast.error('Error previewing audience. Please try again.');
        } finally {
            setLoading({ ...loading, preview: false });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name) {
            toast.error('Please enter a campaign name');
            return;
        }

        if (!rules) {
            toast.error('Please generate rules first');
            return;
        }

        setLoading({ ...loading, create: true });
        try {
            await createCampaign({
                name: formData.name,
                rules,
            });
            toast.success('Campaign created and processing started!');

            // Reset form
            setFormData({ name: '', promptText: '' });
            setRules(null);
            setAudienceSize(null);
        } catch (error) {
            console.error('Error creating campaign:', error);
            toast.error('Error creating campaign. Please try again.');
        } finally {
            setLoading({ ...loading, create: false });
        }
    };

    // Helper to render rule inputs based on the rules object
    const renderRuleInputs = () => {
        if (!rules) return null;

        return Object.entries(rules).map(([field, operators]) => {
            return Object.entries(operators).map(([operator, value]) => {
                const fieldLabels = {
                    totalSpend: 'Total Spend',
                    visits: 'Number of Visits',
                    lastActiveDate: 'Last Active Date',
                };

                const operatorLabels = {
                    gt: 'Greater Than',
                    gte: 'Greater Than or Equal',
                    lt: 'Less Than',
                    lte: 'Less Than or Equal',
                    eq: 'Equal To',
                    ne: 'Not Equal To',
                };

                return (
                    <Form.Group
                        key={`${field}-${operator}`}
                        className="mb-3"
                    >
                        <Form.Label>
                            {fieldLabels[field] || field} {operatorLabels[operator] || operator}
                        </Form.Label>
                        <Form.Control
                            type="number"
                            value={value}
                            onChange={(e) => handleRuleChange(field, operator, e.target.value)}
                        />
                    </Form.Group>
                );
            });
        });
    };

    return (
        <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
                <h4 className="mb-0">Create New Campaign</h4>
            </Card.Header>
            <Card.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Campaign Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter campaign name"
                        />
                    </Form.Group>

                    <Card className="mb-4">
                        <Card.Header>Step 1: Generate Rules with AI</Card.Header>
                        <Card.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>Enter your targeting criteria in plain English</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="promptText"
                                    value={formData.promptText}
                                    onChange={handleChange}
                                    placeholder="e.g., Customers who spent more than 5000 and visited less than 3 times"
                                />
                            </Form.Group>
                            <Button
                                variant="secondary"
                                onClick={handleGenerateRules}
                                disabled={loading.generate}
                            >
                                {loading.generate ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            className="me-2"
                                        />
                                        Generating...
                                    </>
                                ) : (
                                    'Generate Rules'
                                )}
                            </Button>
                        </Card.Body>
                    </Card>

                    {rules && (
                        <Card className="mb-4">
                            <Card.Header>Step 2: Edit Rules</Card.Header>
                            <Card.Body>
                                {renderRuleInputs()}
                                <Button
                                    variant="info"
                                    onClick={handlePreviewAudience}
                                    disabled={loading.preview}
                                    className="me-2"
                                >
                                    {loading.preview ? (
                                        <>
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                                className="me-2"
                                            />
                                            Calculating...
                                        </>
                                    ) : (
                                        'Preview Audience'
                                    )}
                                </Button>
                                {audienceSize !== null && (
                                    <span className="ms-2 text-primary">
                                        This campaign will target <strong>{audienceSize}</strong> customers
                                    </span>
                                )}
                            </Card.Body>
                        </Card>
                    )}

                    <Row className="mt-4">
                        <Col>
                            <Button
                                variant="primary"
                                type="submit"
                                size="lg"
                                disabled={loading.create || !rules}
                                className="w-100"
                            >
                                {loading.create ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            className="me-2"
                                        />
                                        Creating Campaign...
                                    </>
                                ) : (
                                    'Create Campaign'
                                )}
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default CampaignForm;