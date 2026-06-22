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

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className={styles.cartPageContainer}>
      <h2 className={styles.cartHeading}>
        Your <span>Cart</span>
      </h2>
      <div className={styles.cartGrid}>
        <div className={styles.itemsContainer}>
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
        <div className={styles.summaryContainer}>
          <span className={styles.summaryTitle}>Order Summary</span>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Subtotal</span>
            <span
              className={styles.summaryValue}
            >{`$${subtotal.toFixed(2)}`}</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Shipping</span>
            <span className={styles.summaryValue}>Free</span>
          </div>
          <div className={styles.summaryTotal}>
            <span className={styles.summaryLabel}>Total</span>
            {/* putting subtotal here for now since i'm not actually calculating shipping */}
            <span
              className={styles.summaryValue}
            >{`$${subtotal.toFixed(2)}`}</span>
          </div>
          <button className={styles.checkoutBtn}>Checkout</button>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
