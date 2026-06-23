import { Plus, Minus } from 'lucide-react';
import { useState } from 'react';

import styles from './ProductCard.module.css';

function ProductCard({ id, title, price, image, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [buttonText, setButtonText] = useState('Add to cart');

  function handleChange(e) {
    const val = e.target.value;

    // Safely handle empty inputs so users can backspace completely
    if (val === '') {
      setQuantity('');
      return;
    }

    // Convert string value to a number
    const numValue = Number(val);

    // Prevent 0 or negative numbers
    if (numValue <= 0) {
      return;
    }

    setQuantity(numValue);
  }

  function handleIncrement() {
    const newVal = quantity + 1;
    setQuantity(newVal);
  }

  function handleDecrement() {
    if (quantity === 1) return;

    const newVal = quantity - 1;
    setQuantity(newVal);
  }

  function handleAddToCart() {
    const product = { id, title, price, image, quantity };
    onAddToCart(product);

    setButtonText('Added ✓');

    // Revert back to 'add to cart' after 2 seconds (2000 ms)
    setTimeout(() => {
      setButtonText('Add to cart');
    }, 2000);
  }

  return (
    <div className={styles.card}>
      <div className={styles.imgWrap}>
        <img src={image} alt={title} className={styles.img} />
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.price}>{`$${price.toFixed(2)}`}</p>
        <div className={styles.quantityContainer}>
          <button onClick={handleDecrement} className={styles.quantityBtn}>
            <Minus className={styles.quantitySvg} />
          </button>
          <input
            type="number"
            min="1"
            onChange={handleChange}
            value={quantity}
          />
          <button onClick={handleIncrement} className={styles.quantityBtn}>
            <Plus className={styles.quantitySvg} />
          </button>
        </div>
        <button onClick={handleAddToCart} className={styles.addBtn}>
          {buttonText}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
