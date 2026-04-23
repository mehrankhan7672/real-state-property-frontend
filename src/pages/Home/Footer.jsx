import React from "react";
import styles from "./Home.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <div className={styles.footerLogo}>
              <span className={styles.logoIcon}>🏢</span>
              <span className={styles.logoText}>Dubai Real Estate</span>
            </div>
            <p className={styles.footerDescription}>
              Your trusted partner for luxury properties and real estate
              investments in Dubai.
            </p>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink}>
                📘
              </a>
              <a href="#" className={styles.socialLink}>
                📷
              </a>
              <a href="#" className={styles.socialLink}>
                🐦
              </a>
              <a href="#" className={styles.socialLink}>
                💼
              </a>
            </div>
          </div>

          <div className={styles.footerSection}>
            <h4>Quick Links</h4>
            <ul className={styles.footerLinks}>
              <li>
                <a href="#">About Us</a>
              </li>
              <li>
                <a href="#">Properties</a>
              </li>
              <li>
                <a href="#">Agents</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h4>Support</h4>
            <ul className={styles.footerLinks}>
              <li>
                <a href="#">FAQs</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Terms of Service</a>
              </li>
              <li>
                <a href="#">Help Center</a>
              </li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h4>Contact Info</h4>
            <ul className={styles.contactInfo}>
              <li>📍 Downtown Dubai, UAE</li>
              <li>📞 +971 4 123 4567</li>
              <li>✉️ info@dubaicareestate.com</li>
              <li>🕒 Mon-Fri: 9AM - 6PM</li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>
            © 2026 Dubai Real Estate. All rights reserved. | Your Gateway to
            Luxury Living
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
