// app/product/[id].tsx
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Share,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../lib/supabase";
import { useCart } from "../../context/CartContext";
import colors from "../../constants/theme";

const { width } = Dimensions.get("window");

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    getProductDetail();
  }, [id]);

  const getProductDetail = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    Alert.alert(
      "Berhasil!",
      `${quantity} ${product.title} ditambahkan ke keranjang`,
      [
        { text: "Lanjut Belanja", style: "cancel" },
        {
          text: "Lihat Keranjang",
          onPress: () => router.push("/(tabs)/cart"),
        },
      ]
    );
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push("/(tabs)/cart");
  };

  const handleShareProduct = async () => {
    try {
      const deepLink = `krispedfurnitureapp://product/${product.id}`;
      const message = `🛋️ ${product.title}\n💰 ${formatPrice(
        product.price
      )}\n\n🔗 Buka di app: ${deepLink}`;

      const result = await Share.share({
        message: message,
        title: product.title,
        url: deepLink, // iOS will use this
      });

      if (result.action === Share.sharedAction) {
        console.log("✅ Product shared successfully!");
        if (result.activityType) {
          console.log("Shared via:", result.activityType);
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("Share dismissed");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      Alert.alert("Error", "Gagal membagikan produk");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Produk tidak ditemukan</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleShareProduct}
          >
            <Ionicons
              name="share-social-outline"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="heart-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <Image
          source={{
            uri: product.image_url || "https://via.placeholder.com/400",
          }}
          style={styles.productImage}
          resizeMode="cover"
        />

        {/* Product Info */}
        <View style={styles.contentContainer}>
          {/* Price Section */}
          <View style={styles.priceSection}>
            <View style={styles.priceRow}>
              <Text style={styles.price}>{formatPrice(product.price)}</Text>
              {product.discount && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>{product.discount}%</Text>
                </View>
              )}
            </View>
            {product.original_price && (
              <View style={styles.originalPriceRow}>
                <Text style={styles.originalPrice}>
                  {formatPrice(product.original_price)}
                </Text>
                <Text style={styles.savings}>
                  Hemat {formatPrice(product.original_price - product.price)}
                </Text>
              </View>
            )}
          </View>

          {/* Product Name */}
          <Text style={styles.productName}>{product.title}</Text>

          {/* Rating & Sold */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="star" size={16} color="#FFA500" />
              <Text style={styles.statText}>
                {product.rating || "4.5"} (120 rating)
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statText}>
                Terjual {product.sold || "100+"}
              </Text>
            </View>
          </View>

          {/* Seller Info */}
          <View style={styles.sellerSection}>
            <View style={styles.sellerInfo}>
              <View style={styles.sellerAvatar}>
                <Ionicons name="storefront" size={20} color={colors.primary} />
              </View>
              <View style={styles.sellerDetails}>
                <Text style={styles.sellerName}>Krisped Furniture Store</Text>
                <View style={styles.locationRow}>
                  <Ionicons name="location-outline" size={12} color="#8E8E8E" />
                  <Text style={styles.locationText}>{product.location}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.chatButton}>
              <Ionicons
                name="chatbubble-outline"
                size={18}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detail Produk</Text>
            <Text style={styles.description}>
              {product.description ||
                "Produk furniture berkualitas tinggi dengan desain modern dan material pilihan."}
            </Text>
          </View>

          {/* Specifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Spesifikasi</Text>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Kategori</Text>
              <Text style={styles.specValue}>
                {product.category_id === 1 ? "Kursi & Sofa" : "Meja & Lemari"}
              </Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Stok</Text>
              <Text style={styles.specValue}>{product.stock || "10"} unit</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Kondisi</Text>
              <Text style={styles.specValue}>Baru</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        {/* Quantity Selector */}
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
            style={styles.quantityButton}
          >
            <Ionicons name="remove" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            onPress={() => setQuantity(Math.min(product.stock, quantity + 1))}
            style={styles.quantityButton}
          >
            <Ionicons name="add" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart}>
            <Ionicons name="cart-outline" size={20} color={colors.primary} />
            <Text style={styles.cartButtonText}>Keranjang</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buyButton} onPress={handleBuyNow}>
            <Text style={styles.buyButtonText}>Beli Sekarang</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    zIndex: 10,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
  },
  backButton: {
    padding: 4,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: {
    width: width,
    height: width,
    backgroundColor: "#F5F5F5",
  },
  contentContainer: {
    padding: 16,
  },
  priceSection: {
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  price: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary,
    marginRight: 8,
  },
  discountBadge: {
    backgroundColor: "#FF4444",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  originalPriceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  originalPrice: {
    fontSize: 14,
    color: "#8E8E8E",
    textDecorationLine: "line-through",
    marginRight: 8,
  },
  savings: {
    fontSize: 12,
    color: "#4CAF50",
  },
  productName: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
    lineHeight: 28,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    fontSize: 13,
    color: "#8E8E8E",
    marginLeft: 4,
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 12,
  },
  sellerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  sellerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  sellerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  sellerDetails: {
    flex: 1,
  },
  sellerName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 12,
    color: "#8E8E8E",
    marginLeft: 2,
  },
  chatButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
  },
  section: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  specLabel: {
    fontSize: 14,
    color: "#8E8E8E",
  },
  specValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "500",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    padding: 16,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginHorizontal: 16,
    minWidth: 30,
    textAlign: "center",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  cartButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 8,
    gap: 6,
  },
  cartButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.primary,
  },
  buyButton: {
    flex: 1.5,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buyButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFF",
  },
});
