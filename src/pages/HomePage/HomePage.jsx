import { Link } from 'react-router-dom';

import styles from './HomePage.module.css';

function HomePage() {
  const marqueeItems = [
    'Free Shipping',
    'New Drops Weekly',
    'Gear That Lasts',
    'Style Is Attitude',
    'No Hype — Just Quality',
  ];

  // doubled for seamless loop
  const marqueeItemsDoubled = [...marqueeItems, ...marqueeItems];

  return (
    <div className={styles.homePageContainer}>
      <div className={styles.hero}>
        <div className={styles.heroBgText}>VOID</div>
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>New Drop - Limited Stock</p>
          <h1 className={styles.heroHeading}>
            Dress
            <br />
            like you
            <br />
            <em>mean it.</em>
          </h1>
          <p className={styles.heroPara}>
            Gear for the ones who don't ask for permission.
            <br />
            Street-ready apparel, tech, and accessories —<br />
            curated for people who move forward.
          </p>
        </div>
        <Link to="/shop" className={styles.shopLink}>
          Shop Now
        </Link>
      </div>

      <div className={styles.marqueeWrap}>
        <div className={styles.marqueeTrack}>
          {marqueeItemsDoubled.map((item, index) => (
            <span className={styles.marqueeItem} key={index}>
              <span>✦</span>
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.statsBar}>
        <div className={styles.stat}>
          <div className={styles.statNum}>20+</div>
          <div className={styles.statLabel}>Products in Stock</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statNum}>$7.95</div>
          <div className={styles.statLabel}>Starting Price</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statNum}>5★</div>
          <div className={styles.statLabel}>Avg. Rating</div>
        </div>
      </div>

      <div className={styles.aboutUs}>
        <h2>
          No Logos.
          <br />
          No Hype.
          <br />
          Just Quality.
        </h2>
        <p>
          We stock pieces built to last, priced to move. From technical
          outerwear to portable storage — if it makes your setup sharper, it
          belongs here.
        </p>
      </div>
    </div>
  );
}

export default HomePage;
