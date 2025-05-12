import React from 'react';
import { Row, Col } from 'react-bootstrap';
import CampaignForm from '../components/CampaignForm';

const Campaigns = () => {
    return (
        <div>
            <h1 className="mb-4">Create Campaign</h1>
            <Row>
                <Col md={12}>
                    <p className="lead mb-4">
                        Create a new campaign using AI to target specific customer segments.
                        Enter your targeting criteria in plain English, and our AI will generate
                        structured rules that you can edit before saving.
                    </p>
                    <CampaignForm />
                </Col>
            </Row>
        </div>
    );
};

export default Campaigns; 