import React from "react";
import styles from "./Home.module.css";

const InfoCards = () => {
  const cards = [
    {
      icon: "🏠",
      title: "Luxury Villas",
      description:
        "Exclusive villas in Palm Jumeirah, Emirates Hills, and Jumeirah with private pools and beach access.",
      color: "#3b82f6",
    },
    {
      icon: "🏢",
      title: "Modern Apartments",
      description:
        "Contemporary apartments in Downtown Dubai, Dubai Marina, and Business Bay with stunning views.",
      color: "#8b5cf6",
    },
    {
      icon: "🏭",
      title: "Commercial Spaces",
      description:
        "Prime office spaces, retail outlets, and commercial properties in prime business districts.",
      color: "#ec489a",
    },
    {
      icon: "🏖️",
      title: "Beachfront Properties",
      description:
        "Stunning beachfront properties with private beaches and panoramic ocean views.",
      color: "#14b8a6",
    },
  ];

  return (
    <section className={styles.infoCards}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Explore Property Types</h2>
        <p className={styles.sectionSubtitle}>
          Discover a wide range of properties tailored to your lifestyle and
          investment goals
        </p>
        <div className={styles.cardsGrid}>
          {cards.map((card, index) => (
            <div key={index} className={styles.card}>
              <div
                className={styles.cardIcon}
                style={{ background: `${card.color}20`, color: card.color }}
              >
                {card.icon}
              </div>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardDescription}>{card.description}</p>
              <button className={styles.cardButton}>Learn More →</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InfoCards;
