import NavBar from './components/NavBar/NavBar';
import { Outlet } from 'react-router-dom';
import Footer from './components/Footer/Footer';

import useCart from './hooks/useCart';

import styles from './App.module.css';

function App() {
  const { cart, addToCart, removeFromCart, updateQuantity, totalItems } =
    useCart();

  return (
    <div className={styles.app}>
      <NavBar cartCount={totalItems} />
      <main className={styles.dynamicContent}>
        <Outlet context={{ cart, addToCart, removeFromCart, updateQuantity }} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
