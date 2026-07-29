// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PromoPage from './pages/PromoPage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-300">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/promos" element={<PromoPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>
    </div>
  );
}