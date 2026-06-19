import { useState } from 'react';
import { Plus, Minus, Trash } from 'lucide-react';

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

  return (
    <div>
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>{price}</p>
      <div>
        <Minus
          onClick={() =>
            quantity === 1
              ? onRemoveFromCart(id)
              : onUpdateQuantity(id, quantity - 1)
          }
        />
        <input
          type="number"
          min="1"
          value={displayValue} // Derived state, no useEffect needed
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Plus onClick={() => onUpdateQuantity(id, quantity + 1)} />
        <Trash onClick={() => onRemoveFromCart(id)} />
      </div>
    </div>
  );
}

export default CartItem;
