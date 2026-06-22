import styles from './Footer.module.css';

function Footer() {
  return (
    <div className={styles.footerWrapper}>
      <footer className={styles.footer}>
        <div className={styles.brand}>
          VOID<span>.</span>
        </div>
        <div className={styles.copy}>© 2026 VOID. All rights reserved.</div>
      </footer>
    </div>
  );
}

export default Footer;
