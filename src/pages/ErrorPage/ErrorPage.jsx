import { Link } from 'react-router-dom';

import styles from './ErrorPage.module.css';

function ErrorPage() {
  return (
    <div className={styles.errorContainer}>
      <h2>404</h2>
      <h3>Page not found</h3>
      <p>
        Looks like this page dropped off. It may have moved, been removed, or
        never existed in the first place.
      </p>
      <Link to={'/'} className={styles.homeLink}>
        Home
      </Link>
    </div>
  );
}

export default ErrorPage;
