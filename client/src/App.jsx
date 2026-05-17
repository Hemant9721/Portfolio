import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Skills from './components/sections/Skills';
import Projects from './components/sections/Projects';
import Contact from './components/sections/Contact';
import useAdminStore from './store/adminStore';

export default function App() {
  const { verifyToken, isAdmin } = useAdminStore();

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  return (
    <div className="min-h-screen bg-[#050508] noise-overlay">
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#13131f',
            color: '#e2e8f0',
            border: '1px solid rgba(124,58,237,0.3)',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px',
            borderRadius: '12px',
          },
          success: { iconTheme: { primary: '#7c3aed', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      <Navbar />
      {/*
        When admin banner is visible (32px = 2rem), shift the entire main content
        down by that amount so #home doesn't get clipped behind the banner.
        The navbar itself handles its own top offset via top-8.
      */}
      <main style={{ paddingTop: isAdmin ? '2rem' : '0' }}>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
