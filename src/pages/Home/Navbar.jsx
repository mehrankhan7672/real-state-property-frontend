import React, { useState } from "react";
import styles from "./Home.module.css";
import Login from "../auth/Login";
import Register from "../auth/Register";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.navbarContent}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🏢</span>
            <span className={styles.logoText}>Dubai Real Estate</span>
          </div>

          <button
            className={styles.menuToggle}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>

          <div
            className={`${styles.navLinks} ${isMenuOpen ? styles.active : ""}`}
          >
            <a href="/" className={styles.navLink}>
              Home
            </a>
            <div className={styles.navButtons}>
              <Link
                to={"/login"}
                element={<Login />}
                className={styles.loginBtn}
              >
                Login
              </Link>
              <Link
                to={"/register"}
                element={<Register />}
                className={styles.registerBtn}
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
