// app/(tabs)/home.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import SearchBar from "../../components/SearchBar";
import colors from "../../constants/theme";
import { supabase } from "../../lib/supabase";

const { width } = Dimensions.get("window");
const PRODUCT_WIDTH = (width - 48) / 2; // 2 kolom dengan padding

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("products").select("*");
      if (error) {
        console.error("Error fetching products:", error);
        return;
      }
      setProducts(data || []);
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const filteredProducts = products.filter((p) => {
    if (!p || !p.title) return false;
    return p.title.toLowerCase().includes(search.toLowerCase());
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>Krisped Furniture</Text>
        </View>
        <SearchBar value={search} setValue={setSearch} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading produk...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Krisped Furniture</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="mail-outline" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={colors.text}
            />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <SearchBar value={search} setValue={setSearch} />

      {/* Banner Promo */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.bannerContainer}
      >
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Diskon 50%</Text>
          <Text style={styles.bannerSubtitle}>Untuk pembelian pertama</Text>
        </View>
        <View style={[styles.banner, { backgroundColor: "#4CAF50" }]}>
          <Text style={styles.bannerTitle}>Gratis Ongkir</Text>
          <Text style={styles.bannerSubtitle}>Min. belanja Rp 100.000</Text>
        </View>
        <View style={[styles.banner, { backgroundColor: "#FF9800" }]}>
          <Text style={styles.bannerTitle}>Cashback 20%</Text>
          <Text style={styles.bannerSubtitle}>Maksimal Rp 50.000</Text>
        </View>
      </ScrollView>

      {/* Kategori */}
      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {["Sofa", "Meja", "Kursi", "Lemari", "Rak", "Kasur"].map((cat) => (
            <TouchableOpacity key={cat} style={styles.categoryItem}>
              <View style={styles.categoryIcon}>
                <Ionicons
                  name="cube-outline"
                  size={28}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.categoryText}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Section Title */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Rekomendasi Untuk Anda</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>Lihat Semua</Text>
        </TouchableOpacity>
      </View>

      {/* Product Grid */}
      <View style={styles.productGrid}>
        {filteredProducts.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.productCard}
            onPress={() => router.push(`/product/${item.id}`)}
          >
            {/* Image Container with Overlay */}
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: item.image_url || "https://via.placeholder.com/200",
                }}
                style={styles.productImage}
                resizeMode="cover"
              />

              {/* Discount Badge */}
              {item.discount && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>{item.discount}% OFF</Text>
                </View>
              )}

              {/* Wishlist Button */}
              <TouchableOpacity style={styles.wishlistButton}>
                <Ionicons name="heart-outline" size={18} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={2}>
                {item.name}
              </Text>

              <View style={styles.priceContainer}>
                <Text style={styles.productPrice}>
                  {formatPrice(item.price)}
                </Text>
                {item.original_price && item.original_price > item.price && (
                  <Text style={styles.originalPrice}>
                    {formatPrice(item.original_price)}
                  </Text>
                )}
              </View>

              <View style={styles.ratingContainer}>
                <View style={styles.ratingStars}>
                  <Ionicons name="star" size={14} color="#FFB800" />
                  <Text style={styles.ratingText}>{item.rating || "4.5"}</Text>
                </View>
                <Text style={styles.soldText}>
                  • Terjual {item.sold || "100+"}
                </Text>
              </View>

              <View style={styles.locationContainer}>
                <Ionicons name="location-outline" size={12} color="#8E8E8E" />
                <Text style={styles.locationText}>
                  {item.location || "Jakarta"}
                </Text>
              </View>

              {/* Free Shipping Badge - Optional */}
              {item.free_shipping && (
                <View style={styles.shippingBadge}>
                  <Ionicons name="car-outline" size={10} color="#4CAF50" />
                  <Text style={styles.shippingText}>Gratis Ongkir</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={64} color="#CCCCCC" />
          <Text style={styles.emptyText}>Produk tidak ditemukan</Text>
          <Text style={styles.emptySubtext}>Coba kata kunci lain</Text>
        </View>
      )}

      <View style={{ height: 20 }} />
    </ScrollView>
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
    backgroundColor: colors.background,
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#FF4444",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  bannerContainer: {
    paddingLeft: 16,
    marginVertical: 16,
  },
  banner: {
    width: 280,
    height: 120,
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    justifyContent: "center",
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: "#FFF",
    opacity: 0.9,
  },
  categoryContainer: {
    paddingLeft: 16,
    marginBottom: 20,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 20,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    color: colors.text,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  seeAll: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "600",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 14,
    color: "#8E8E8E",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#8E8E8E",
    marginTop: 4,
  },

  // Additional styles for overlay buttons
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  productCard: {
    width: PRODUCT_WIDTH,
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    // Enhanced Shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: PRODUCT_WIDTH,
    backgroundColor: "#F8F9FA",
  },
  discountBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#FF4444",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  discountText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  wishlistButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
    lineHeight: 18,
    fontWeight: "600",
    height: 36,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    flexWrap: "wrap",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
    marginRight: 6,
  },
  originalPrice: {
    fontSize: 12,
    color: "#8E8E8E",
    textDecorationLine: "line-through",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  ratingStars: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 6,
  },
  ratingText: {
    fontSize: 12,
    color: colors.text,
    marginLeft: 4,
    fontWeight: "500",
  },
  soldText: {
    fontSize: 11,
    color: "#8E8E8E",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  locationText: {
    fontSize: 11,
    color: "#8E8E8E",
    marginLeft: 4,
  },
  shippingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  shippingText: {
    fontSize: 10,
    color: "#4CAF50",
    fontWeight: "500",
    marginLeft: 2,
  },
});
