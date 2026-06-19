import { NavLink } from 'react-router-dom';

import styles from './NavBar.module.css';

function NavBar({ cartCount }) {
  return (
    <div className={styles.navBarWrapper}>
      <nav className={styles.navBar}>
        <div className={styles.logo}>
          Void
          <span>.</span>
        </div>
        <div>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.activeLink}` : styles.link
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/shop"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.activeLink}` : styles.link
            }
          >
            Shop
          </NavLink>
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.activeLink}` : styles.link
            }
          >
            Cart
            {cartCount > 0 && (
              <span className={styles.cartCount}>{cartCount}</span>
            )}
          </NavLink>
        </div>
      </nav>
    </div>
  );
}

export default NavBar;
