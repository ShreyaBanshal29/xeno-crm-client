import React from 'react';
import { Row, Col } from 'react-bootstrap';
import CampaignList from '../components/CampaignList';

const CampaignHistory = () => {
    return (
        <div>
            <h1 className="mb-4">Campaign History</h1>
            <Row>
                <Col md={12}>
                    <p className="lead mb-4">
                        View all your past campaigns, their targeting rules, audience size, and current status.
                    </p>
                    <CampaignList />
                </Col>
            </Row>
        </div>
    );
};

export default CampaignHistory; 