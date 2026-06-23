import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';

import useCart from './useCart.js';

// ---------------------------------------------------------------------------
// Minimal consumer component — mirrors realistic hook usage
// ---------------------------------------------------------------------------
const PRODUCTS = {
  apple: { id: 1, name: 'Apple', price: 0.99, quantity: 1 },
  banana: { id: 2, name: 'Banana', price: 0.49, quantity: 1 },
};

function TestCart() {
  const { cart, addToCart, removeFromCart, updateQuantity, totalItems } =
    useCart();

  return (
    <div>
      <p>Total items: {totalItems}</p>

      {/* Controls to trigger hook actions */}
      <button onClick={() => addToCart(PRODUCTS.apple)}>Add Apple</button>
      <button onClick={() => addToCart(PRODUCTS.banana)}>Add Banana</button>

      {/* Render current cart state */}
      {cart.length === 0 && <p>Cart is empty</p>}
      <ul>
        {cart.map((item) => (
          <li key={item.id}>
            <span>{item.name}</span>
            <span> x{item.quantity}</span>
            <button
              aria-label={`Decrease quantity of ${item.name}`}
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
            >
              -
            </button>
            <button
              aria-label={`Increase quantity of ${item.name}`}
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              +
            </button>
            <button
              aria-label={`Remove ${item.name}`}
              onClick={() => removeFromCart(item.id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function renderCart() {
  const user = userEvent.setup();
  render(<TestCart />);
  return { user };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('useCart', () => {
  describe('Initial state', () => {
    it('starts with an empty cart', () => {
      renderCart();
      expect(screen.getByText('Cart is empty')).toBeInTheDocument();
    });

    it('starts with a total item count of 0', () => {
      renderCart();
      expect(screen.getByText('Total items: 0')).toBeInTheDocument();
    });
  });

  describe('addToCart', () => {
    it('adds a new item to the cart', async () => {
      const { user } = renderCart();

      await user.click(screen.getByRole('button', { name: /add apple/i }));

      expect(screen.getByText('Apple')).toBeInTheDocument();
    });

    it('removes the empty cart message once an item is added', async () => {
      const { user } = renderCart();

      await user.click(screen.getByRole('button', { name: /add apple/i }));

      expect(screen.queryByText('Cart is empty')).not.toBeInTheDocument();
    });

    it('sets the initial quantity to 1 when a new item is added', async () => {
      const { user } = renderCart();

      await user.click(screen.getByRole('button', { name: /add apple/i }));

      expect(screen.getByText('x1')).toBeInTheDocument();
    });

    it('increments quantity instead of duplicating an existing item', async () => {
      const { user } = renderCart();

      await user.click(screen.getByRole('button', { name: /add apple/i }));
      await user.click(screen.getByRole('button', { name: /add apple/i }));

      // Only one list item for Apple
      expect(screen.getAllByRole('listitem')).toHaveLength(1);
      expect(screen.getByText('x2')).toBeInTheDocument();
    });

    it('adds multiple distinct items as separate cart entries', async () => {
      const { user } = renderCart();

      await user.click(screen.getByRole('button', { name: /add apple/i }));
      await user.click(screen.getByRole('button', { name: /add banana/i }));

      expect(screen.getAllByRole('listitem')).toHaveLength(2);
      expect(screen.getByText('Apple')).toBeInTheDocument();
      expect(screen.getByText('Banana')).toBeInTheDocument();
    });

    it('updates totalItems correctly after adding new items', async () => {
      const { user } = renderCart();

      await user.click(screen.getByRole('button', { name: /add apple/i }));
      await user.click(screen.getByRole('button', { name: /add banana/i }));

      expect(screen.getByText('Total items: 2')).toBeInTheDocument();
    });

    it('reflects the incremented quantity in totalItems', async () => {
      const { user } = renderCart();

      await user.click(screen.getByRole('button', { name: /add apple/i }));
      await user.click(screen.getByRole('button', { name: /add apple/i }));
      await user.click(screen.getByRole('button', { name: /add apple/i }));

      expect(screen.getByText('Total items: 3')).toBeInTheDocument();
    });
  });

  describe('removeFromCart', () => {
    it('removes an item from the cart', async () => {
      const { user } = renderCart();

      await user.click(screen.getByRole('button', { name: /add apple/i }));
      await user.click(screen.getByRole('button', { name: /remove apple/i }));

      expect(screen.queryByText('Apple')).not.toBeInTheDocument();
    });

    it('shows the empty cart message after the last item is removed', async () => {
      const { user } = renderCart();

      await user.click(screen.getByRole('button', { name: /add apple/i }));
      await user.click(screen.getByRole('button', { name: /remove apple/i }));

      expect(screen.getByText('Cart is empty')).toBeInTheDocument();
    });

    it('only removes the targeted item, leaving others intact', async () => {
      const { user } = renderCart();

      await user.click(screen.getByRole('button', { name: /add apple/i }));
      await user.click(screen.getByRole('button', { name: /add banana/i }));
      await user.click(screen.getByRole('button', { name: /remove apple/i }));

      expect(screen.queryByText('Apple')).not.toBeInTheDocument();
      expect(screen.getByText('Banana')).toBeInTheDocument();
    });

    it('updates totalItems correctly after removal', async () => {
      const { user } = renderCart();

      await user.click(screen.getByRole('button', { name: /add apple/i }));
      await user.click(screen.getByRole('button', { name: /add banana/i }));
      await user.click(screen.getByRole('button', { name: /remove apple/i }));

      expect(screen.getByText('Total items: 1')).toBeInTheDocument();
    });

    it('resets totalItems to 0 when all items are removed', async () => {
      const { user } = renderCart();

      await user.click(screen.getByRole('button', { name: /add apple/i }));
      await user.click(screen.getByRole('button', { name: /remove apple/i }));

      expect(screen.getByText('Total items: 0')).toBeInTheDocument();
    });
  });

  describe('updateQuantity', () => {
    it('increases the quantity of an item', async () => {
      const { user } = renderCart();

      await user.click(screen.getByRole('button', { name: /add apple/i }));
      await user.click(
        screen.getByRole('button', { name: /increase quantity of apple/i }),
      );

      expect(screen.getByText('x2')).toBeInTheDocument();
    });

    it('decreases the quantity of an item', async () => {
      const { user } = renderCart();

      await user.click(screen.getByRole('button', { name: /add apple/i }));
      await user.click(
        screen.getByRole('button', { name: /increase quantity of apple/i }),
      );
      await user.click(
        screen.getByRole('button', { name: /decrease quantity of apple/i }),
      );

      expect(screen.getByText('x1')).toBeInTheDocument();
    });

    it('does not allow quantity to drop below 1', async () => {
      const { user } = renderCart();

      await user.click(screen.getByRole('button', { name: /add apple/i }));
      // Apple starts at quantity 1 — attempt to decrement below the floor
      await user.click(
        screen.getByRole('button', { name: /decrease quantity of apple/i }),
      );

      expect(screen.getByText('x1')).toBeInTheDocument();
    });

    it('only updates the targeted item quantity', async () => {
      const { user } = renderCart();

      await user.click(screen.getByRole('button', { name: /add apple/i }));
      await user.click(screen.getByRole('button', { name: /add banana/i }));
      await user.click(
        screen.getByRole('button', { name: /increase quantity of apple/i }),
      );

      const items = screen.getAllByRole('listitem');
      expect(items[0]).toHaveTextContent('x2'); // Apple
      expect(items[1]).toHaveTextContent('x1'); // Banana unchanged
    });

    it('reflects quantity changes in totalItems', async () => {
      const { user } = renderCart();

      await user.click(screen.getByRole('button', { name: /add apple/i }));
      await user.click(
        screen.getByRole('button', { name: /increase quantity of apple/i }),
      );
      await user.click(
        screen.getByRole('button', { name: /increase quantity of apple/i }),
      );

      expect(screen.getByText('Total items: 3')).toBeInTheDocument();
    });
  });

  describe('totalItems', () => {
    it('correctly sums quantities across multiple different items', async () => {
      const { user } = renderCart();

      await user.click(screen.getByRole('button', { name: /add apple/i }));
      await user.click(screen.getByRole('button', { name: /add apple/i }));
      await user.click(screen.getByRole('button', { name: /add banana/i }));

      // Apple x2 + Banana x1 = 3
      expect(screen.getByText('Total items: 3')).toBeInTheDocument();
    });
  });
});
