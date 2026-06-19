import NavBar from './components/NavBar/NavBar';
import { Outlet } from 'react-router-dom';

import useCart from './hooks/useCart';

function App() {
  const { cart, addToCart, removeFromCart, updateQuantity, totalItems } =
    useCart();

  return (
    <>
      <NavBar cartCount={totalItems} />
      <Outlet context={{ cart, addToCart, removeFromCart, updateQuantity }} />
    </>
  );
}

export default App;
