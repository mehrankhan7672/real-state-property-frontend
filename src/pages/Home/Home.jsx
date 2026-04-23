import React, { useState } from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import InfoCards from "./InfoCards";
import Footer from "./Footer";
import styles from "./Home.module.css";

const Home = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Subscribed with email: ${email}`);
    setEmail("");
  };

  return (
    <div className={styles.home}>
      <Navbar />
      <Hero />
      <InfoCards />

      {/* Call to Action Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h3 className={styles.ctaTitle}>Get Started Today!</h3>
            <p className={styles.ctaDescription}>
              Sign up now and explore Dubai's real estate market with
              confidence. Your dream property is just a few clicks away.
            </p>
            <button className={styles.ctaButton}>Register Now</button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className={styles.newsletterSection}>
        <div className={styles.container}>
          <div className={styles.newsletterContent}>
            <h3 className={styles.newsletterTitle}>📧 Stay Updated</h3>
            <p className={styles.newsletterDescription}>
              Get the latest property listings, market trends, and exclusive
              offers directly in your inbox.
            </p>
            <form onSubmit={handleSubscribe} className={styles.newsletterForm}>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.newsletterInput}
              />
              <button type="submit" className={styles.newsletterButton}>
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <h3 className={styles.sectionTitle}>Why Choose Us?</h3>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🏆</div>
              <h4>Trusted Platform</h4>
              <p>
                Over 10,000+ successful transactions and 5,000+ happy clients
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔒</div>
              <h4>Secure Transactions</h4>
              <p>
                100% secure and transparent property transactions with legal
                support
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🚀</div>
              <h4>Fast Response</h4>
              <p>
                Get responses within 24 hours from our dedicated support team
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>💰</div>
              <h4>Best Prices</h4>
              <p>
                Competitive pricing and exclusive deals directly from developers
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
