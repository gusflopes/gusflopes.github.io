import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { HomePage } from './components/pages/HomePage';
import { RadarPage } from './components/pages/RadarPage';
import { InsightsPage } from './components/pages/InsightsPage';
import { ArticlePage2 } from './components/pages/ArticlePage2';
import { RadarArticlePage } from './components/pages/RadarArticlePage';
import { PrivacyPolicyPage } from './components/pages/PrivacyPolicyPage';
import { TermsOfUsePage } from './components/pages/TermsOfUsePage';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/utils/ScrollToTop';

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="bg-slate-950 min-h-screen text-slate-200 overflow-x-hidden font-sans selection:bg-orange-500/30">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/radar" element={<RadarPage />} />
          <Route path="/radar/article/:id" element={<RadarArticlePage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/insights/article" element={<ArticlePage2 />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfUsePage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}
