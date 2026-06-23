import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import ShopPage from './ShopPage';

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------

vi.mock('react-router-dom', () => ({
  useOutletContext: vi.fn(),
}));

vi.mock('../../hooks/useFetchProducts', () => ({
  default: vi.fn(),
}));

// Stub ProductCard to isolate ShopPage behavior.
// It renders just enough to verify ShopPage passes props correctly.
vi.mock('../../components/ProductCard/ProductCard', () => ({
  default: ({ title, price, onAddToCart, id }) => (
    <div data-testid={`product-card-${id}`}>
      <span>{title}</span>
      <span>{price}</span>
      <button onClick={() => onAddToCart({ id, title, price })}>
        Add to cart
      </button>
    </div>
  ),
}));

// ---------------------------------------------------------------------------
// Import mocks AFTER vi.mock calls (hoisting is handled by vitest)
// ---------------------------------------------------------------------------
import { useOutletContext } from 'react-router-dom';
import useFetchProducts from '../../hooks/useFetchProducts';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------
const MOCK_PRODUCTS = [
  { id: 1, title: 'Air Force 1', price: 110, image: 'af1.jpg' },
  { id: 2, title: 'Dunk Low', price: 100, image: 'dunk.jpg' },
  { id: 3, title: 'Air Max 90', price: 120, image: 'am90.jpg' },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function setupMocks({ loading = false, error = null, products = [] } = {}) {
  useFetchProducts.mockReturnValue({ loading, error, products });
  useOutletContext.mockReturnValue({ addToCart: vi.fn() });
}

function renderShopPage() {
  const user = userEvent.setup();
  render(<ShopPage />);
  return { user };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('ShopPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading state', () => {
    it('renders a loading message while fetching', () => {
      setupMocks({ loading: true });
      renderShopPage();

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('does not render the shop heading while loading', () => {
      setupMocks({ loading: true });
      renderShopPage();

      expect(
        screen.queryByRole('heading', { name: /the drop/i }),
      ).not.toBeInTheDocument();
    });

    it('does not render any product cards while loading', () => {
      setupMocks({ loading: true });
      renderShopPage();

      expect(
        screen.queryByRole('button', { name: /add to cart/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe('Error state', () => {
    it('renders a network error message when an error occurs', () => {
      setupMocks({ error: new Error('Network error') });
      renderShopPage();

      expect(
        screen.getByText('A network error was encountered'),
      ).toBeInTheDocument();
    });

    it('does not render the shop heading when an error occurs', () => {
      setupMocks({ error: new Error('Network error') });
      renderShopPage();

      expect(
        screen.queryByRole('heading', { name: /the drop/i }),
      ).not.toBeInTheDocument();
    });

    it('does not render any product cards when an error occurs', () => {
      setupMocks({ error: new Error('Network error') });
      renderShopPage();

      expect(
        screen.queryByRole('button', { name: /add to cart/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe('Success state', () => {
    it('renders the shop heading', () => {
      setupMocks({ products: MOCK_PRODUCTS });
      renderShopPage();

      expect(
        screen.getByRole('heading', { name: /the drop/i }),
      ).toBeInTheDocument();
    });

    it('renders a card for every product returned', () => {
      setupMocks({ products: MOCK_PRODUCTS });
      renderShopPage();

      const cards = screen.getAllByRole('button', { name: /add to cart/i });
      expect(cards).toHaveLength(MOCK_PRODUCTS.length);
    });

    it('renders each product title', () => {
      setupMocks({ products: MOCK_PRODUCTS });
      renderShopPage();

      MOCK_PRODUCTS.forEach(({ title }) => {
        expect(screen.getByText(title)).toBeInTheDocument();
      });
    });

    it('renders each product price', () => {
      setupMocks({ products: MOCK_PRODUCTS });
      renderShopPage();

      MOCK_PRODUCTS.forEach(({ price }) => {
        expect(screen.getByText(price)).toBeInTheDocument();
      });
    });

    it('renders an empty product grid when the API returns no products', () => {
      setupMocks({ products: [] });
      renderShopPage();

      expect(
        screen.queryByRole('button', { name: /add to cart/i }),
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: /the drop/i }),
      ).toBeInTheDocument();
    });
  });

  describe('addToCart integration', () => {
    it('calls addToCart with the correct product when its button is clicked', async () => {
      const addToCart = vi.fn();
      useFetchProducts.mockReturnValue({
        loading: false,
        error: null,
        products: MOCK_PRODUCTS,
      });
      useOutletContext.mockReturnValue({ addToCart });

      const user = userEvent.setup();
      render(<ShopPage />);

      await user.click(
        screen.getAllByRole('button', { name: /add to cart/i })[0],
      );

      expect(addToCart).toHaveBeenCalledOnce();
      expect(addToCart).toHaveBeenCalledWith({
        id: MOCK_PRODUCTS[0].id,
        title: MOCK_PRODUCTS[0].title,
        price: MOCK_PRODUCTS[0].price,
      });
    });

    it('calls addToCart independently for each product card', async () => {
      const addToCart = vi.fn();
      useFetchProducts.mockReturnValue({
        loading: false,
        error: null,
        products: MOCK_PRODUCTS,
      });
      useOutletContext.mockReturnValue({ addToCart });

      const user = userEvent.setup();
      render(<ShopPage />);

      const buttons = screen.getAllByRole('button', { name: /add to cart/i });
      for (const button of buttons) {
        await user.click(button);
      }

      expect(addToCart).toHaveBeenCalledTimes(MOCK_PRODUCTS.length);
    });

    it('does not call addToCart on initial render', () => {
      const addToCart = vi.fn();
      useFetchProducts.mockReturnValue({
        loading: false,
        error: null,
        products: MOCK_PRODUCTS,
      });
      useOutletContext.mockReturnValue({ addToCart });

      render(<ShopPage />);

      expect(addToCart).not.toHaveBeenCalled();
    });
  });
});
