import React from "react";
import styles from "./Home.module.css";

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Find Your Dream Property in{" "}
              <span className={styles.highlight}>Dubai</span>
            </h1>
            <p className={styles.heroDescription}>
              Discover luxury apartments, villas, and commercial spaces in the
              most prestigious locations across Dubai. Your perfect property
              awaits.
            </p>
            <div className={styles.heroButtons}>
              <button className={styles.primaryBtn}>Explore Properties</button>
              <button className={styles.secondaryBtn}>Contact Agent</button>
            </div>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <div className={styles.statNumber}>500+</div>
                <div className={styles.statLabel}>Properties</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>50+</div>
                <div className={styles.statLabel}>Agents</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>1000+</div>
                <div className={styles.statLabel}>Happy Clients</div>
              </div>
            </div>
          </div>
          <div className={styles.heroImage}>
            <img
              src="https://images.pexels.com/photos/2587054/pexels-photo-2587054.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
              alt="Luxury Property in Dubai"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
