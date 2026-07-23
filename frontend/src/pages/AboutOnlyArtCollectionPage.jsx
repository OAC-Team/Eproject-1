import { Link } from 'react-router-dom';
import '../themes/AboutOnlyArtCollectionPage.css';

export default function AboutOnlyArtCollectionPage() {
  return (
    <>
      {/* Header & Navigation */}
      <header className="about-header">
        <div className="header-container">
          <Link to="/gallery">
            <img className="about-logo" src="/Logo.png" alt="OnlyArt Logo" />
          </Link>
          <nav className="about-nav">
            <Link to="/gallery">Gallery</Link>
            <Link to="/">About Us</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Sign Up</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <span className="brand-badge">About Us</span>
          <h1>OnlyArtCollection</h1>
          <p className="hero-quote">The intersection of harmonious souls and the colorful world of art</p>
          <div className="accent-line"></div>
        </div>
      </section>

      <div className="section-container">
        {/* Story Section */}
        <section className="about-story-section">
          <div className="about-content">
            {/* Image Wrapper */}
            <div className="about-image-wrapper">
              <div className="image-frame">
                <img
                  src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop"
                  alt="OnlyArt Gallery Space"
                />
              </div>
            </div>

            {/* Text Details */}
            <div className="about-text-details">
              <h2>Creating a <span className="highlight-text">Vibrant Art Space</span></h2>
              <p>
                Born out of a burning passion for painting, <strong>OnlyArtCollection</strong> is not merely a
                display website—it is a living, digital exhibition space that blurs the geographical boundaries
                between artists and art lovers.
              </p>
              <p>
                We believe that art should not be confined within the four walls of traditional galleries. Here,
                you are free to immerse yourself in exquisite brushstrokes, discover new art movements, and find
                creative inspiration every single day.
              </p>

              {/* Stats Grid */}
              <div className="about-stats-grid">
                <div className="stat-card">
                  <span className="stat-number">15K+</span>
                  <span className="stat-label">Artworks</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">800+</span>
                  <span className="stat-label">Artists &amp; Creators</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">30M+</span>
                  <span className="stat-label">Interactions</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">50+</span>
                  <span className="stat-label">Virtual Exhibitions</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Core Values Section */}
      <section className="about-values-section">
        <div className="section-container">
          <div className="section-title-center">
            <h2>Core Values</h2>
            <p>The principles that shape and guide our mission</p>
            <div className="small-accent-line"></div>
          </div>

          <div className="values-grid">
            <div className="value-card-premium">
              <div className="value-icon-circle">🎨</div>
              <h3>Honor Identity</h3>
              <p>We believe each painting is its own story, reflecting the artist's unique soul and perspective.</p>
            </div>
            <div className="value-card-premium">
              <div className="value-icon-circle">✨</div>
              <h3>Limitless Creativity</h3>
              <p>An open space connecting everything from traditional oil paintings and classic watercolors to modern digital art.</p>
            </div>
            <div className="value-card-premium">
              <div className="value-icon-circle">🤝</div>
              <h3>Bridge of Passion</h3>
              <p>Bringing young artistic talents closer to the public, collectors, and art enthusiasts worldwide.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="about-cta-section">
        <div className="section-container">
          <h2>Embark on Your Artistic Journey</h2>
          <p>Explore thousands of unique artworks and connect with talented creators globally.</p>
          <div className="cta-buttons">
            <Link to="/gallery" className="cta-btn cta-primary">Explore Gallery</Link>
            <Link to="/register" className="cta-btn cta-secondary">Join Now</Link>
          </div>
        </div>
      </section>
    </>
  );
}
