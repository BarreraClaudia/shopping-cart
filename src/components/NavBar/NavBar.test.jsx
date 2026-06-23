import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import NavBar from './NavBar';

// Helper to render NavBar within a router context
const renderNavBar = (cartCount = 0, initialPath = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <NavBar cartCount={cartCount} />
      <Routes>
        <Route path="/" element={<div>Home Page</div>} />
        <Route path="/shop" element={<div>Shop Page</div>} />
        <Route path="/cart" element={<div>Cart Page</div>} />
      </Routes>
    </MemoryRouter>,
  );
};

describe('NavBar', () => {
  describe('Rendering', () => {
    it('renders the logo text', () => {
      renderNavBar();
      expect(screen.getByText('Void')).toBeInTheDocument();
    });

    it('renders the logo decorative dot span', () => {
      renderNavBar();
      expect(screen.getByText('.')).toBeInTheDocument();
    });

    it('renders the Home navigation link', () => {
      renderNavBar();
      expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    });

    it('renders the Shop navigation link', () => {
      renderNavBar();
      expect(screen.getByRole('link', { name: /shop/i })).toBeInTheDocument();
    });

    it('renders the Cart navigation link', () => {
      renderNavBar();
      expect(screen.getByRole('link', { name: /cart/i })).toBeInTheDocument();
    });

    it('renders all three navigation links', () => {
      renderNavBar();
      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(3);
    });
  });

  describe('Navigation link hrefs', () => {
    it('Home link points to "/"', () => {
      renderNavBar();
      expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute(
        'href',
        '/',
      );
    });

    it('Shop link points to "/shop"', () => {
      renderNavBar();
      expect(screen.getByRole('link', { name: /shop/i })).toHaveAttribute(
        'href',
        '/shop',
      );
    });

    it('Cart link points to "/cart"', () => {
      renderNavBar();
      expect(screen.getByRole('link', { name: /cart/i })).toHaveAttribute(
        'href',
        '/cart',
      );
    });
  });

  describe('Cart badge', () => {
    it('does not render a cart count badge when cartCount is 0', () => {
      renderNavBar(0);
      expect(screen.queryByText('0')).not.toBeInTheDocument();
    });

    it('does not render a cart count badge when cartCount is not provided', () => {
      renderNavBar();
      const cartLink = screen.getByRole('link', { name: /cart/i });
      // The link should only contain the text "Cart" with no numeric badge
      expect(cartLink.textContent).toBe('Cart');
    });

    it('renders the cart count badge when cartCount is greater than 0', () => {
      renderNavBar(3);
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('renders the correct cart count value', () => {
      renderNavBar(12);
      expect(screen.getByText('12')).toBeInTheDocument();
    });

    it('renders the cart count badge inside the Cart link', () => {
      renderNavBar(5);
      const cartLink = screen.getByRole('link', { name: /cart/i });
      expect(cartLink).toHaveTextContent('5');
    });

    it('does not render cart count badge when cartCount is negative', () => {
      renderNavBar(-1);
      expect(screen.queryByText('-1')).not.toBeInTheDocument();
    });

    it('updates the badge when cartCount prop changes', () => {
      const { rerender } = render(
        <MemoryRouter initialEntries={['/']}>
          <NavBar cartCount={2} />
        </MemoryRouter>,
      );
      expect(screen.getByText('2')).toBeInTheDocument();

      rerender(
        <MemoryRouter initialEntries={['/']}>
          <NavBar cartCount={7} />
        </MemoryRouter>,
      );
      expect(screen.getByText('7')).toBeInTheDocument();
      expect(screen.queryByText('2')).not.toBeInTheDocument();
    });

    it('removes the badge when cartCount drops to 0', () => {
      const { rerender } = render(
        <MemoryRouter initialEntries={['/']}>
          <NavBar cartCount={4} />
        </MemoryRouter>,
      );
      expect(screen.getByText('4')).toBeInTheDocument();

      rerender(
        <MemoryRouter initialEntries={['/']}>
          <NavBar cartCount={0} />
        </MemoryRouter>,
      );
      expect(screen.queryByText('4')).not.toBeInTheDocument();
    });
  });

  describe('Active link state', () => {
    it('applies an active class to the Home link when on the "/" route', () => {
      renderNavBar(0, '/');
      const homeLink = screen.getByRole('link', { name: /home/i });
      // NavLink adds aria-current="page" to the active link
      expect(homeLink).toHaveAttribute('aria-current', 'page');
    });

    it('does not mark Shop or Cart as active when on the "/" route', () => {
      renderNavBar(0, '/');
      expect(screen.getByRole('link', { name: /shop/i })).not.toHaveAttribute(
        'aria-current',
        'page',
      );
      expect(screen.getByRole('link', { name: /cart/i })).not.toHaveAttribute(
        'aria-current',
        'page',
      );
    });

    it('applies an active class to the Shop link when on the "/shop" route', () => {
      renderNavBar(0, '/shop');
      expect(screen.getByRole('link', { name: /shop/i })).toHaveAttribute(
        'aria-current',
        'page',
      );
    });

    it('does not mark Home or Cart as active when on the "/shop" route', () => {
      renderNavBar(0, '/shop');
      expect(screen.getByRole('link', { name: /home/i })).not.toHaveAttribute(
        'aria-current',
        'page',
      );
      expect(screen.getByRole('link', { name: /cart/i })).not.toHaveAttribute(
        'aria-current',
        'page',
      );
    });

    it('applies an active class to the Cart link when on the "/cart" route', () => {
      renderNavBar(0, '/cart');
      expect(screen.getByRole('link', { name: /cart/i })).toHaveAttribute(
        'aria-current',
        'page',
      );
    });

    it('does not mark Home or Shop as active when on the "/cart" route', () => {
      renderNavBar(0, '/cart');
      expect(screen.getByRole('link', { name: /home/i })).not.toHaveAttribute(
        'aria-current',
        'page',
      );
      expect(screen.getByRole('link', { name: /shop/i })).not.toHaveAttribute(
        'aria-current',
        'page',
      );
    });

    it('only one link is active at a time', () => {
      renderNavBar(0, '/shop');
      const activeLinks = screen
        .getAllByRole('link')
        .filter((link) => link.getAttribute('aria-current') === 'page');
      expect(activeLinks).toHaveLength(1);
    });
  });

  describe('User interaction / navigation', () => {
    it('navigates to the Shop page when the Shop link is clicked', async () => {
      const user = userEvent.setup();
      renderNavBar(0, '/');

      await user.click(screen.getByRole('link', { name: /shop/i }));

      expect(await screen.findByText('Shop Page')).toBeInTheDocument();
    });

    it('navigates to the Cart page when the Cart link is clicked', async () => {
      const user = userEvent.setup();
      renderNavBar(0, '/');

      await user.click(screen.getByRole('link', { name: /cart/i }));

      expect(await screen.findByText('Cart Page')).toBeInTheDocument();
    });

    it('navigates to the Home page when the Home link is clicked', async () => {
      const user = userEvent.setup();
      renderNavBar(0, '/shop');

      await user.click(screen.getByRole('link', { name: /home/i }));

      expect(await screen.findByText('Home Page')).toBeInTheDocument();
    });

    it('marks Shop link as active after navigating to it', async () => {
      const user = userEvent.setup();
      renderNavBar(0, '/');

      await user.click(screen.getByRole('link', { name: /shop/i }));

      const shopLink = await screen.findByRole('link', { name: /shop/i });
      expect(shopLink).toHaveAttribute('aria-current', 'page');
    });

    it('removes active state from Home link after navigating away', async () => {
      const user = userEvent.setup();
      renderNavBar(0, '/');

      expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute(
        'aria-current',
        'page',
      );

      await user.click(screen.getByRole('link', { name: /cart/i }));

      await screen.findByText('Cart Page');
      expect(screen.getByRole('link', { name: /home/i })).not.toHaveAttribute(
        'aria-current',
        'page',
      );
    });
  });

  describe('Accessibility', () => {
    it('renders a <nav> landmark element', () => {
      renderNavBar();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('all links are keyboard-focusable anchor elements', () => {
      renderNavBar();
      const links = screen.getAllByRole('link');
      links.forEach((link) => {
        expect(link.tagName).toBe('A');
      });
    });
  });
});
