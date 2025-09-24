import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/Auth/AuthProvider';
import MetaTags from './components/SEO/MetaTags';
import Header from './components/Header';
import Hero from './components/Hero';
import Destinations from './components/Destinations';
import ItineraryPlanner from './components/ItineraryPlanner';
import Marketplace from './components/Marketplace';
import Culture from './components/Culture';
import Guides from './components/Guides';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer';
import DashboardRoute from './components/Dashboard/DashboardRoute';
import ProfileRoute from './components/Profile/ProfileRoute';
import VerificationPortal from './components/BlockchainVerification/VerificationPortal';

const HomePage = () => (
  <>
    <Hero />
    <Destinations />
    <ItineraryPlanner />
    <VerificationPortal />
    <Marketplace />
    <Culture />
    <Guides />
  </>
);

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen">
            <MetaTags />
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<DashboardRoute />} />
                <Route path="/seller" element={<DashboardRoute />} />
                <Route path="/profile" element={<ProfileRoute />} />
              </Routes>
            </main>
            <Routes>
              <Route path="/" element={<Footer />} />
            </Routes>
            <Routes>
              <Route path="/" element={<Chatbot />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;