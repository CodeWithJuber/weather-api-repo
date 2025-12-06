import { useState, useEffect } from 'react';
import { publicApi } from '../services/api';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Features from '../components/Features';
import Pricing from '../components/Pricing';
import Stats from '../components/Stats';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

function HomePage() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await publicApi.getContent();
        setContent(response.data);
      } catch (err) {
        console.error('Failed to fetch content:', err);
        setError('Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading-container">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="homepage">
      <Navbar companyName={content?.footer?.companyName} />
      <Hero data={content?.hero} />
      <Services services={content?.services || []} />
      <Stats stats={content?.stats || []} />
      <Features features={content?.features || []} />
      <Pricing plans={content?.pricingPlans || []} />
      <Testimonials testimonials={content?.testimonials || []} />
      <Contact data={content?.contact} />
      <Footer data={content?.footer} />
    </div>
  );
}

export default HomePage;
