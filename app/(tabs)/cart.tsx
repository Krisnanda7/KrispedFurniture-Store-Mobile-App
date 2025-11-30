// app/(tabs)/cart.tsx
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCart } from "../../context/CartContext";
import colors from "../../constants/theme";

export default function Cart() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } =
    useCart();

  // Debug: Log cart whenever it changes
  useEffect(() => {
    console.log("📦 Cart updated!");
    console.log("Cart items:", cart.length);
    cart.forEach((item, index) => {
      console.log(
        `  ${index + 1}. ${item.title} (ID: ${
          item.id
        }, Type: ${typeof item.id})`
      );
    });
  }, [cart]);

  // DEBUG FUNCTION - HAPUS SETELAH SELESAI!
  const handleClearStorage = async () => {
    try {
      await AsyncStorage.removeItem("@cart");
      console.log("✅ Storage cleared!");
      Alert.alert("Success", "Storage cleared! Silakan restart app.", [
        { text: "OK", onPress: () => clearCart() },
      ]);
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleRemoveItemDirect = (productId: string, productName: string) => {
    console.log("🗑️ Direct remove item:", productName);
    removeFromCart(productId);
  };

  const handleRemoveItem = (productId: string, productName: string) => {
    console.log("🚨 handleRemoveItem called");
    console.log("Product ID:", productId);
    console.log("Product Name:", productName);
    console.log("Type of ID:", typeof productId);

    Alert.alert(
      "Hapus dari Keranjang?",
      productName,
      [
        {
          text: "Batal",
          style: "cancel",
          onPress: () => console.log("❌ Cancel pressed"),
        },
        {
          text: "Hapus",
          style: "destructive",
          onPress: () => {
            console.log(
              "✅ Hapus confirmed, calling removeFromCart with ID:",
              productId
            );
            removeFromCart(productId);
            console.log("removeFromCart executed");
          },
        },
      ],
      {
        cancelable: true,
        onDismiss: () => console.log("Alert dismissed"),
      }
    );
  };

  const handleClearCart = () => {
    console.log("🗑️ handleClearCart called, current cart length:", cart.length);

    if (cart.length === 0) {
      console.log("Cart is empty, not showing alert");
      return;
    }

    Alert.alert(
      "Hapus Semua Item?",
      `Yakin ingin menghapus ${cart.length} item dari keranjang?`,
      [
        {
          text: "Batal",
          style: "cancel",
          onPress: () => console.log("❌ Cancel clear cart"),
        },
        {
          text: "Hapus Semua",
          style: "destructive",
          onPress: () => {
            console.log("✅ Clear cart confirmed");
            clearCart();
            console.log("clearCart executed");
          },
        },
      ],
      {
        cancelable: true,
        onDismiss: () => console.log("Clear cart alert dismissed"),
      }
    );
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert("Keranjang Kosong", "Tambahkan produk terlebih dahulu");
      return;
    }

    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    Alert.alert(
      "Checkout",
      `Total Pembayaran: ${formatPrice(
        getCartTotal()
      )}\nJumlah Item: ${itemCount} produk\n\nFitur pembayaran akan segera hadir!`,
      [{ text: "OK" }]
    );
  };

  if (cart.length === 0) {
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Keranjang Belanja</Text>
        </View>

        {/* Empty State */}
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="cart-outline" size={80} color="#CCCCCC" />
          </View>
          <Text style={styles.emptyTitle}>Keranjang Masih Kosong</Text>
          <Text style={styles.emptySubtitle}>
            Yuk, isi dengan furniture impianmu!
          </Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => router.push("/(tabs)/home")}
          >
            <Text style={styles.shopButtonText}>Mulai Belanja</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const subtotal = getCartTotal();
  const shipping = 0; // Gratis ongkir
  const total = subtotal + shipping;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Keranjang Belanja</Text>
        {/* Icons Refresh dan Trash di header */}
        {/* <View style={{ flexDirection: "row", gap: 12 }}>
          <TouchableOpacity
            onPress={handleClearStorage}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="refresh-outline" size={24} color="#FF9800" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleClearCart}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="trash-outline" size={24} color="#FF4444" />
          </TouchableOpacity>
        </View> */}
      </View>

      {/* Cart Items */}
      <ScrollView style={styles.cartList} showsVerticalScrollIndicator={false}>
        {/* Promo Banner */}
        <View style={styles.promoBanner}>
          <Ionicons name="gift-outline" size={24} color={colors.primary} />
          <Text style={styles.promoText}>
            Gratis ongkir untuk semua pembelian!
          </Text>
        </View>

        {/* Cart Items List */}
        {cart.map((item, index) => (
          <View key={`${item.id}-${index}`} style={styles.cartItem}>
            <TouchableOpacity
              onPress={() => router.push(`/product/${item.id}`)}
            >
              <Image
                source={{
                  uri: item.image_url || "https://via.placeholder.com/100",
                }}
                style={styles.itemImage}
                resizeMode="cover"
              />
            </TouchableOpacity>

            <View style={styles.itemDetails}>
              <Text style={styles.itemName} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>

              {/* Quantity Control */}
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => {
                    console.log("⬇️ Decrease quantity for:", item.id);
                    updateQuantity(item.id, item.quantity - 1);
                  }}
                  hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                >
                  <Ionicons name="remove" size={16} color={colors.text} />
                </TouchableOpacity>

                <Text style={styles.quantityText}>{item.quantity}</Text>

                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => {
                    console.log("⬆️ Increase quantity for:", item.id);
                    if (item.quantity < item.stock) {
                      updateQuantity(item.id, item.quantity + 1);
                    } else {
                      Alert.alert(
                        "Stok Terbatas",
                        `Stok tersisa ${item.stock} unit`
                      );
                    }
                  }}
                  hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                >
                  <Ionicons name="add" size={16} color={colors.text} />
                </TouchableOpacity>
              </View>

              {item.quantity >= item.stock && (
                <Text style={styles.stockWarning}>Stok terbatas</Text>
              )}
            </View>

            {/* Remove Button - Direct Delete (No Confirmation) */}
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => {
                console.log("❌ Remove button pressed - DIRECT DELETE");
                console.log("Item ID:", item.id);
                console.log("Item Title:", item.title);
                handleRemoveItemDirect(item.id, item.title);
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close-circle" size={24} color="#FF4444" />
            </TouchableOpacity>
          </View>
        ))}

        {/* Recommendation */}
        <View style={styles.recommendationBanner}>
          <Text style={styles.recommendationTitle}>💡 Mungkin Kamu Suka</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/explore")}>
            <Text style={styles.recommendationLink}>Lihat Produk Lainnya</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 200 }} />
      </ScrollView>

      {/* Bottom Summary */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.shippingLabel}>
            <Text style={styles.summaryLabel}>Ongkir</Text>
            <View style={styles.freeShippingBadge}>
              <Text style={styles.freeShippingText}>GRATIS</Text>
            </View>
          </View>
          <Text style={[styles.summaryValue, styles.strikethrough]}>Rp 0</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.totalRow}>
          <View>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.itemCount}>
              {cart.length} item ({totalItems} produk)
            </Text>
          </View>
          <Text style={styles.totalValue}>{formatPrice(total)}</Text>
        </View>

        {/* Checkout Button */}
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}
          activeOpacity={0.8}
        >
          <Text style={styles.checkoutButtonText}>Checkout</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#8E8E8E",
    textAlign: "center",
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
  },
  shopButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  cartList: {
    flex: 1,
  },
  promoBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F8FF",
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  promoText: {
    flex: 1,
    fontSize: 13,
    color: colors.primary,
    fontWeight: "500",
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  itemName: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  quantityText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginHorizontal: 12,
    minWidth: 25,
    textAlign: "center",
  },
  stockWarning: {
    fontSize: 11,
    color: "#FF6B6B",
    marginTop: 4,
  },
  removeButton: {
    padding: 4,
  },
  recommendationBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#FFF9E6",
    borderRadius: 8,
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  recommendationLink: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: "600",
  },
  summaryContainer: {
    backgroundColor: "#FFF",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#8E8E8E",
  },
  summaryValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "500",
  },
  shippingLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  freeShippingBadge: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  freeShippingText: {
    fontSize: 10,
    color: "#FFF",
    fontWeight: "bold",
  },
  strikethrough: {
    textDecorationLine: "line-through",
    color: "#CCCCCC",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },
  itemCount: {
    fontSize: 12,
    color: "#8E8E8E",
    marginTop: 2,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
  },
  checkoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  checkoutButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
