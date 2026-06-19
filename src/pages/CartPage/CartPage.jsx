import { useOutletContext } from 'react-router-dom';

import CartItem from '../../components/CartItem/CartItem';
import styles from './CartPage.module.css';

function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useOutletContext();

  if (cart.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <h3>Nothing here yet</h3>
        <p>
          Your cart is empty. Head to the shop and grab something worth wearing.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.cartPageContainer}>
      {cart.map((product) => (
        <CartItem
          key={product.id}
          id={product.id}
          image={product.image}
          title={product.title}
          price={product.price}
          quantity={product.quantity}
          onRemoveFromCart={removeFromCart}
          onUpdateQuantity={updateQuantity}
        />
      ))}
    </div>
  );
}

export default CartPage;
