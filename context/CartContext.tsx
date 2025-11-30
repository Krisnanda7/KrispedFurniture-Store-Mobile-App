// context/CartContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface CartItem {
  id: string;
  title: string;
  price: number;
  image_url: string;
  quantity: number;
  stock: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from AsyncStorage on mount
  useEffect(() => {
    loadCart();
  }, []);

  // Save cart to AsyncStorage whenever it changes (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      saveCart();
    }
  }, [cart, isLoaded]);

  const loadCart = async () => {
    try {
      const savedCart = await AsyncStorage.getItem("@cart");
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        console.log("📥 Loaded cart from storage:", parsedCart.length, "items");
        setCart(parsedCart);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveCart = async () => {
    try {
      await AsyncStorage.setItem("@cart", JSON.stringify(cart));
      console.log("💾 Saved cart to storage:", cart.length, "items");
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  };

  const addToCart = (product: any, quantity: number) => {
    console.log(
      "➕ Adding to cart:",
      product.title,
      "Qty:",
      quantity,
      "ID:",
      product.id
    );
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => String(item.id) === String(product.id)
      );

      if (existingItem) {
        console.log("Item exists, updating quantity");
        return prevCart.map((item) =>
          String(item.id) === String(product.id)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        console.log("Adding new item");
        const newItem = {
          id: String(product.id), // Ensure ID is string
          title: product.title,
          price: product.price,
          image_url: product.image_url,
          quantity: quantity,
          stock: product.stock,
        };
        console.log("New item:", newItem);
        return [...prevCart, newItem];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    console.log("🗑️ Removing from cart, ID:", productId);
    console.log(
      "Current cart before remove:",
      cart.map((i) => ({ id: i.id, title: i.title }))
    );

    // Create new array immediately
    const newCart = cart.filter((item) => {
      const itemId = String(item.id).trim();
      const searchId = String(productId).trim();
      const shouldKeep = itemId !== searchId;

      console.log(
        `Comparing: "${itemId}" vs "${searchId}" - Keep: ${shouldKeep}`
      );
      return shouldKeep;
    });

    console.log("✅ New cart length:", newCart.length);
    console.log(
      "New cart items:",
      newCart.map((i) => i.title)
    );

    // Force state update
    setCart([...newCart]);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    console.log("🔄 Updating quantity:", productId, "New qty:", quantity);

    if (quantity <= 0) {
      console.log("Quantity is 0 or less, removing item");
      removeFromCart(productId);
      return;
    }

    const updatedCart = cart.map((item) => {
      if (String(item.id) === String(productId)) {
        console.log(`Updated ${item.title} quantity to ${quantity}`);
        return { ...item, quantity };
      }
      return item;
    });

    setCart([...updatedCart]);
  };

  const clearCart = () => {
    console.log("🗑️ Clearing entire cart");
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
