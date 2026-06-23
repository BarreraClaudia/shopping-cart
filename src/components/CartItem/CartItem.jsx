import { useState } from 'react';
import { Plus, Minus, Trash } from 'lucide-react';

import styles from './CartItem.module.css';

function CartItem({
  id,
  image,
  title,
  price,
  quantity,
  onUpdateQuantity,
  onRemoveFromCart,
}) {
  // Track only the raw text string. Defaults to null so it falls back to the prop.
  const [typedValue, setTypedValue] = useState(null);

  // The true visual value: use what they typed if it's currently an empty string, otherwise the prop
  const displayValue = typedValue === '' ? '' : quantity;

  function handleChange(e) {
    const val = e.target.value;

    if (val === '') {
      setTypedValue(''); // Allows backspace to blank out the input
      return;
    }

    const newQuantity = Number(val);
    if (newQuantity < 1) return;

    setTypedValue(null); // Reset back to relying on the prop
    onUpdateQuantity(id, newQuantity);
  }

  function handleBlur() {
    setTypedValue(null); // Reset typing tracking
    if (displayValue === '') {
      onRemoveFromCart(id);
    }
  }

  function quantityPrice(quantity, price) {
    const total = quantity * price;
    return `$${total.toFixed(2)}`;
  }

  return (
    <div className={styles.cartItemContainer}>
      <div className={styles.imgWrap}>
        <img src={image} alt={title} className={styles.img} />
      </div>
      <div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.price}>{`$${price.toFixed(2)} each`}</p>
      </div>
      <div className={styles.priceAndControls}>
        <p className={styles.quantityPrice}>{quantityPrice(quantity, price)}</p>
        <div className={styles.quantityContainer}>
          <button
            onClick={() =>
              quantity === 1
                ? onRemoveFromCart(id)
                : onUpdateQuantity(id, quantity - 1)
            }
            className={styles.quantityBtn}
          >
            <Minus className={styles.quantitySvg} />
          </button>
          <input
            type="number"
            min="1"
            value={displayValue}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <button
            onClick={() => onUpdateQuantity(id, quantity + 1)}
            className={styles.quantityBtn}
          >
            <Plus className={styles.quantitySvg} />
          </button>
        </div>
        <button
          onClick={() => onRemoveFromCart(id)}
          className={styles.deleteBtn}
        >
          <Trash className={styles.deleteSvg} />
        </button>
      </div>
    </div>
  );
}

export default CartItem;
