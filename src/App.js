import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import Dashboard from './pages/Dashboard';
import Campaigns from './pages/Campaigns';
import CampaignHistory from './pages/CampaignHistory';
import Customers from './pages/Customers';

function App() {
    return (
        <Router>
            <div className="d-flex flex-column min-vh-100">
                <Header />
                <main className="flex-grow-1 container py-4">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/campaigns" element={<Campaigns />} />
                        <Route path="/campaign-history" element={<CampaignHistory />} />
                        <Route path="/customers" element={<Customers />} />
                    </Routes>
                </main>
                <Footer />
                <ToastContainer position="bottom-right" />
            </div>
        </Router>
    );
}

export default App; 