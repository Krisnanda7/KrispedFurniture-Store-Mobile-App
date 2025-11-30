// app/(tabs)/home.tsx
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  RefreshControl,
  Share,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import colors from "../../constants/theme";
import { supabase } from "../../lib/supabase";

const { width } = Dimensions.get("window");
const PRODUCT_WIDTH = (width - 48) / 2;

const PROMO_BANNERS = [
  {
    id: 1,
    title: "Flash Sale 50%",
    subtitle: "Hemat hingga 2 juta",
    color: "#FF6B6B",
    icon: "flash",
  },
  {
    id: 2,
    title: "Gratis Ongkir",
    subtitle: "Min. belanja 100rb",
    color: "#4ECDC4",
    icon: "car",
  },
  {
    id: 3,
    title: "Cashback 20%",
    subtitle: "Maks. 50rb",
    color: "#FFB347",
    icon: "wallet",
  },
];

const QUICK_CATEGORIES = [
  { id: 1, name: "Sofa", icon: "bed-outline", color: "#FF6B6B" },
  { id: 2, name: "Meja", icon: "desktop-outline", color: "#4ECDC4" },
  { id: 1, name: "Kursi", icon: "restaurant-outline", color: "#95E1D3" },
  { id: 2, name: "Lemari", icon: "albums-outline", color: "#FFB347" },
  { id: 2, name: "Rak", icon: "grid-outline", color: "#AA96DA" },
  { id: 1, name: "Kasur", icon: "bed-outline", color: "#FCBAD3" },
];

export default function Home() {
  const router = useRouter();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);

      // Get featured products (dengan diskon)
      const { data: featured } = await supabase
        .from("products")
        .select("*")
        .not("discount", "is", null)
        .order("discount", { ascending: false })
        .limit(6);

      // Get popular products (terlaris)
      const { data: popular } = await supabase
        .from("products")
        .select("*")
        .order("sold", { ascending: false })
        .limit(6);

      // Get new products (terbaru)
      const { data: newest } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);

      setFeaturedProducts(featured || []);
      setPopularProducts(popular || []);
      setNewProducts(newest || []);
    } catch (error) {
      console.error("Error loading home data:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHomeData();
    setRefreshing(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleShareProduct = async (item: any, event: any) => {
    // Prevent navigation when sharing
    event.stopPropagation();

    try {
      const deepLink = `krispedfurnitureapp://product/${item.id}`;
      const message = `🛋️ ${item.title}\n💰 ${formatPrice(
        item.price
      )}\n\n🔗 Buka di app: ${deepLink}`;

      await Share.share({
        message: message,
        title: item.title,
        url: deepLink,
      });

      console.log("✅ Product shared:", item.title);
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const renderProductCard = (item: any) => (
    <TouchableOpacity
      key={item.id}
      style={styles.productCard}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <Image
        source={{ uri: item.image_url || "https://via.placeholder.com/200" }}
        style={styles.productImage}
        resizeMode="cover"
      />

      {item.discount && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{item.discount}%</Text>
        </View>
      )}

      {/* Share Button Overlay */}
      <TouchableOpacity
        style={styles.shareButtonOverlay}
        onPress={(e) => handleShareProduct(item, e)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <View style={styles.shareIconCircle}>
          <Ionicons name="share-social" size={16} color={colors.primary} />
        </View>
      </TouchableOpacity>

      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.title}
        </Text>

        <View style={styles.priceContainer}>
          <Text style={styles.productPrice}>{formatPrice(item.price)}</Text>
          {item.original_price && (
            <Text style={styles.originalPrice}>
              {formatPrice(item.original_price)}
            </Text>
          )}
        </View>

        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#FFA500" />
          <Text style={styles.ratingText}>
            {item.rating || "4.5"} | Terjual {item.sold || "100+"}
          </Text>
        </View>

        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={12} color="#8E8E8E" />
          <Text style={styles.locationText}>{item.location || "Jakarta"}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>Krisped Furniture</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Memuat...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Halo! 👋</Text>
          <Text style={styles.logo}>Krisped Furniture</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="mail-outline" size={24} color={colors.text} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>2</Text>
            </View>
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

      {/* Search Bar - Navigate to Explore */}
      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => router.push("/(tabs)/explore")}
      >
        <Ionicons name="search-outline" size={20} color="#8E8E8E" />
        <Text style={styles.searchPlaceholder}>Cari furniture...</Text>
      </TouchableOpacity>

      {/* Promo Banners */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.bannerContainer}
      >
        {PROMO_BANNERS.map((banner) => (
          <TouchableOpacity key={banner.id} style={styles.banner}>
            <View
              style={[styles.bannerContent, { backgroundColor: banner.color }]}
            >
              <View style={styles.bannerIcon}>
                <Ionicons name={banner.icon as any} size={32} color="#FFF" />
              </View>
              <View>
                <Text style={styles.bannerTitle}>{banner.title}</Text>
                <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Quick Categories */}
      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {QUICK_CATEGORIES.map((cat, index) => (
            <TouchableOpacity
              key={`${cat.id}-${index}`}
              style={styles.categoryItem}
              onPress={() => {
                // Navigate to Explore with category filter
                router.push({
                  pathname: "/(tabs)/explore",
                  params: { categoryId: cat.id, categoryName: cat.name },
                });
              }}
            >
              <View
                style={[
                  styles.categoryIcon,
                  { backgroundColor: cat.color + "20" },
                ]}
              >
                <Ionicons name={cat.icon as any} size={28} color={cat.color} />
              </View>
              <Text style={styles.categoryText}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Featured Products (Flash Sale) */}
      {featuredProducts.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="flash" size={24} color="#FF6B6B" />
              <Text style={styles.sectionTitle}>Flash Sale Hari Ini</Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/explore",
                  params: { sortBy: "discount" },
                })
              }
            >
              <Text style={styles.seeAll}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {featuredProducts.map((item) => (
              <View key={item.id} style={styles.horizontalCard}>
                {renderProductCard(item)}
              </View>
            ))}
          </ScrollView>
        </>
      )}

      {/* Popular Products */}
      {popularProducts.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="flame" size={24} color="#FF6B6B" />
              <Text style={styles.sectionTitle}>Terlaris Minggu Ini</Text>
            </View>
            <TouchableOpacity onPress={() => router.push("/(tabs)/explore")}>
              <Text style={styles.seeAll}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.productGrid}>
            {popularProducts.slice(0, 4).map(renderProductCard)}
          </View>
        </>
      )}

      {/* New Products */}
      {newProducts.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="sparkles" size={24} color="#4ECDC4" />
              <Text style={styles.sectionTitle}>Produk Terbaru</Text>
            </View>
            <TouchableOpacity onPress={() => router.push("/(tabs)/explore")}>
              <Text style={styles.seeAll}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.productGrid}>
            {newProducts.slice(0, 4).map(renderProductCard)}
          </View>
        </>
      )}

      {/* CTA Banner */}
      <TouchableOpacity
        style={styles.ctaBanner}
        onPress={() => router.push("/(tabs)/explore")}
      >
        <View>
          <Text style={styles.ctaTitle}>Jelajahi Semua Produk</Text>
          <Text style={styles.ctaSubtitle}>
            Lebih dari 100+ furniture berkualitas
          </Text>
        </View>
        <Ionicons name="arrow-forward" size={24} color="#FFF" />
      </TouchableOpacity>

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
  greeting: {
    fontSize: 14,
    color: "#8E8E8E",
    marginBottom: 2,
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
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
  },
  searchPlaceholder: {
    marginLeft: 8,
    fontSize: 14,
    color: "#8E8E8E",
  },
  bannerContainer: {
    paddingLeft: 16,
    marginVertical: 12,
  },
  banner: {
    marginRight: 12,
  },
  bannerContent: {
    width: 200,
    height: 100,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  bannerIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 2,
  },
  bannerSubtitle: {
    fontSize: 12,
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
    marginTop: 8,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
  horizontalScroll: {
    paddingLeft: 16,
    marginBottom: 20,
  },
  horizontalCard: {
    marginRight: 12,
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  productCard: {
    width: PRODUCT_WIDTH,
    backgroundColor: "#FFF",
    borderRadius: 8,
    marginHorizontal: 4,
    marginBottom: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: "100%",
    height: PRODUCT_WIDTH,
    backgroundColor: "#F5F5F5",
  },
  discountBadge: {
    position: "absolute",
    top: 8,
    left: 8,
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
  shareButtonOverlay: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
  },
  shareIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  productInfo: {
    padding: 8,
  },
  productName: {
    fontSize: 13,
    color: colors.text,
    marginBottom: 4,
    height: 36,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
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
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 11,
    color: "#8E8E8E",
    marginLeft: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 11,
    color: "#8E8E8E",
    marginLeft: 2,
  },
  ctaBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.primary,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 20,
    borderRadius: 12,
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 4,
  },
  ctaSubtitle: {
    fontSize: 13,
    color: "#FFF",
    opacity: 0.9,
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
});
