import { useReducer } from 'react';

// A shopping cart usually grows beyond just a list of items. If your state is just a bare array ([]), you cannot easily add other global metadata later. By using an object, you can add new state properties seamlessly without breaking your existing components.
const initialState = {
  items: [],
};

// Reducer function managing all cart transformations
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id,
      );

      // If item already exists, increment its quantity
      if (existingItemIndex > -1) {
        const updatedItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
        return { ...state, items: updatedItems };
      }

      // If it is a new item, append it
      return {
        ...state,
        items: [
          ...state.items,
          { ...action.payload, quantity: action.payload.quantity },
        ],
      };
    }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(1, action.payload.quantity) }
            : item,
        ),
      };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

function useCart() {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Helper functions matching the exact reducer action types
  const addToCart = (product) =>
    dispatch({ type: 'ADD_TO_CART', payload: product });

  const removeFromCart = (id) =>
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });

  const updateQuantity = (id, quantity) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cart: state.items, // Export just the array for easy rendering in components
    addToCart,
    removeFromCart,
    updateQuantity,
    totalItems,
  };
}

export default useCart;
