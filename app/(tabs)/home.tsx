// app/(tabs)/home.tsx
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import colors from "../../constants/theme";
import { supabase } from "../../lib/supabase";

const { width } = Dimensions.get("window");
const PRODUCT_WIDTH = (width - 48) / 2;

const PROMO_BANNERS = [
  {
    id: 1,
    title: "Flash Sale 50%",
    subtitle: "Hemat hingga 2 juta",
    gradient: ["#FF6B6B", "#FF8E8E"],
    icon: "flash",
  },
  {
    id: 2,
    title: "Gratis Ongkir",
    subtitle: "Min. belanja 100rb",
    gradient: ["#4ECDC4", "#6DD5CD"],
    icon: "car",
  },
  {
    id: 3,
    title: "Cashback 20%",
    subtitle: "Maks. 50rb",
    gradient: ["#FFB347", "#FFC870"],
    icon: "wallet",
  },
];

const QUICK_CATEGORIES = [
  {
    id: 1,
    name: "Kursi",
    icon: "restaurant-outline",
    gradient: ["#95E1D3", "#B2E8DD"],
  },

  {
    id: 2,
    name: "Meja",
    icon: "desktop-outline",
    gradient: ["#4ECDC4", "#6DD5CD"],
  },
  {
    id: 3,
    name: "Sofa",
    icon: "bed-outline",
    gradient: ["#FF6B6B", "#FF8E8E"],
  },

  {
    id: 4,
    name: "Lemari",
    icon: "albums-outline",
    gradient: ["#FFB347", "#FFC870"],
  },
  {
    id: 5,
    name: "Rak",
    icon: "grid-outline",
    gradient: ["#AA96DA", "#C0AEE6"],
  },
  {
    id: 6,
    name: "Kasur",
    icon: "bed-outline",
    gradient: ["#FCBAD3", "#FDC9DE"],
  },
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

      const { data: featured } = await supabase
        .from("products")
        .select("*")
        .not("discount", "is", null)
        .order("discount", { ascending: false })
        .limit(6);

      const { data: popular } = await supabase
        .from("products")
        .select("*")
        .order("sold", { ascending: false })
        .limit(6);

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
      activeOpacity={0.7}
    >
      <View style={styles.productImageContainer}>
        <Image
          source={{ uri: item.image_url || "https://via.placeholder.com/200" }}
          style={styles.productImage}
          resizeMode="cover"
        />

        {/* Gradient Overlay */}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.05)"]}
          style={styles.imageGradient}
        />

        {item.discount && (
          <View style={styles.discountBadge}>
            <LinearGradient
              colors={["#FF4444", "#FF6666"]}
              style={styles.discountGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.discountText}>-{item.discount}%</Text>
            </LinearGradient>
          </View>
        )}

        {/* Share Button */}
        <TouchableOpacity
          style={styles.shareButtonOverlay}
          onPress={(e) => handleShareProduct(item, e)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.8}
        >
          <View style={styles.shareIconCircle}>
            <Ionicons name="share-social" size={16} color={colors.primary} />
          </View>
        </TouchableOpacity>
      </View>

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

        <View style={styles.metaContainer}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={12} color="#FFA500" />
            <Text style={styles.ratingText}>{item.rating || "4.5"}</Text>
          </View>
          <View style={styles.divider} />
          <Text style={styles.soldText}>Terjual {item.sold || "100+"}</Text>
        </View>

        <View style={styles.locationContainer}>
          <Ionicons name="location" size={11} color="#9CA3AF" />
          <Text style={styles.locationText}>{item.location || "Jakarta"}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={colors.background}
        />
        <View style={styles.headerGradient}>
          <LinearGradient
            colors={[colors.primary + "10", colors.background]}
            style={styles.headerGradientInner}
          >
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <View style={styles.logoCircle}>
                  <Ionicons name="home" size={24} color={colors.primary} />
                </View>
                <Text style={styles.logo}>Krisped Furniture</Text>
              </View>
            </View>
          </LinearGradient>
        </View>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingSpinner}>
            <Ionicons name="refresh" size={40} color={colors.primary} />
          </View>
          <Text style={styles.loadingText}>Memuat produk terbaik...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Header with Gradient */}
        <View style={styles.headerGradient}>
          <LinearGradient
            colors={[colors.primary + "15", colors.background]}
            style={styles.headerGradientInner}
          >
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                {/* <Text style={styles.greeting}>Selamat Datang 👋</Text> */}
                <View style={styles.logoContainer}>
                  <View style={styles.logoCircle}>
                    <Ionicons name="home" size={20} color={colors.primary} />
                  </View>
                  <Text style={styles.logo}>Krisped Furniture</Text>
                </View>
              </View>

              <View style={styles.headerIcons}>
                <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
                  <View style={styles.iconCircle}>
                    <Ionicons
                      name="mail-outline"
                      size={22}
                      color={colors.text}
                    />
                  </View>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>2</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
                  <View style={styles.iconCircle}>
                    <Ionicons
                      name="notifications-outline"
                      size={22}
                      color={colors.text}
                    />
                  </View>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>3</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Enhanced Search Bar */}
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => router.push("/(tabs)/explore")}
          activeOpacity={0.7}
        >
          <View style={styles.searchIconContainer}>
            <Ionicons name="search" size={20} color={colors.primary} />
          </View>
          <Text style={styles.searchPlaceholder}>
            Cari furniture impian Anda...
          </Text>
          <Ionicons name="options-outline" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Premium Promo Banners */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.bannerContainer}
          contentContainerStyle={styles.bannerContent}
        >
          {PROMO_BANNERS.map((banner, index) => (
            <TouchableOpacity
              key={banner.id}
              style={[styles.banner, index === 0 && styles.firstBanner]}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={banner.gradient}
                style={styles.bannerGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.bannerIcon}>
                  <View style={styles.bannerIconInner}>
                    <Ionicons
                      name={banner.icon as any}
                      size={28}
                      color="#FFF"
                    />
                  </View>
                </View>
                <View style={styles.bannerTextContainer}>
                  <Text style={styles.bannerTitle}>{banner.title}</Text>
                  <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
                  <View style={styles.bannerArrow}>
                    <Ionicons name="arrow-forward" size={14} color="#FFF" />
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Elegant Categories */}
        <View style={styles.categorySection}>
          <Text style={styles.categoryTitle}>Kategori Pilihan</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryContent}
          >
            {QUICK_CATEGORIES.map((cat, index) => (
              <TouchableOpacity
                key={`${cat.id}-${index}`}
                style={styles.categoryItem}
                onPress={() => {
                  router.push({
                    pathname: "/(tabs)/explore",
                    params: { categoryId: cat.id, categoryName: cat.name },
                  });
                }}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={cat.gradient}
                  style={styles.categoryIconGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name={cat.icon as any} size={26} color="#FFF" />
                </LinearGradient>
                <Text style={styles.categoryText}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <View style={styles.sectionIconContainer}>
                  <LinearGradient
                    colors={["#FF6B6B", "#FF8E8E"]}
                    style={styles.sectionIconGradient}
                  >
                    <Ionicons name="flash" size={18} color="#FFF" />
                  </LinearGradient>
                </View>
                <View>
                  <Text style={styles.sectionTitle}>Flash Sale</Text>
                  <Text style={styles.sectionSubtitle}>
                    Berakhir dalam 2 jam
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/explore",
                    params: { sortBy: "discount" },
                  })
                }
                activeOpacity={0.7}
              >
                <View style={styles.seeAllButton}>
                  <Text style={styles.seeAll}>Lihat Semua</Text>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={colors.primary}
                  />
                </View>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
              contentContainerStyle={styles.horizontalScrollContent}
            >
              {featuredProducts.map((item) => (
                <View key={item.id} style={styles.horizontalCard}>
                  {renderProductCard(item)}
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Popular Products */}
        {popularProducts.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <View style={styles.sectionIconContainer}>
                  <LinearGradient
                    colors={["#FF6B6B", "#FF8E8E"]}
                    style={styles.sectionIconGradient}
                  >
                    <Ionicons name="flame" size={18} color="#FFF" />
                  </LinearGradient>
                </View>
                <View>
                  <Text style={styles.sectionTitle}>Terlaris</Text>
                  <Text style={styles.sectionSubtitle}>
                    Produk favorit pelanggan
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/explore")}
                activeOpacity={0.7}
              >
                <View style={styles.seeAllButton}>
                  <Text style={styles.seeAll}>Lihat Semua</Text>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={colors.primary}
                  />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.productGrid}>
              {popularProducts.slice(0, 4).map(renderProductCard)}
            </View>
          </View>
        )}

        {/* New Products */}
        {newProducts.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <View style={styles.sectionIconContainer}>
                  <LinearGradient
                    colors={["#4ECDC4", "#6DD5CD"]}
                    style={styles.sectionIconGradient}
                  >
                    <Ionicons name="sparkles" size={18} color="#FFF" />
                  </LinearGradient>
                </View>
                <View>
                  <Text style={styles.sectionTitle}>Produk Terbaru</Text>
                  <Text style={styles.sectionSubtitle}>
                    Koleksi terkini kami
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/explore")}
                activeOpacity={0.7}
              >
                <View style={styles.seeAllButton}>
                  <Text style={styles.seeAll}>Lihat Semua</Text>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={colors.primary}
                  />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.productGrid}>
              {newProducts.slice(0, 4).map(renderProductCard)}
            </View>
          </View>
        )}

        {/* Premium CTA Banner */}
        <TouchableOpacity
          style={styles.ctaBannerContainer}
          onPress={() => router.push("/(tabs)/explore")}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={[colors.primary, colors.primary + "DD"]}
            style={styles.ctaBanner}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.ctaContent}>
              <View style={styles.ctaIconCircle}>
                <Ionicons name="storefront" size={28} color="#FFF" />
              </View>
              <View style={styles.ctaTextContainer}>
                <Text style={styles.ctaTitle}>Jelajahi Semua Produk</Text>
                <Text style={styles.ctaSubtitle}>
                  100+ furniture berkualitas menanti Anda
                </Text>
              </View>
            </View>
            <View style={styles.ctaArrow}>
              <Ionicons name="arrow-forward" size={24} color="#FFF" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerGradient: {
    backgroundColor: colors.background,
  },
  headerGradientInner: {
    paddingTop: Platform.OS === "ios" ? 50 : 40,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: -0.5,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    position: "relative",
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#EF4444",
    borderRadius: 12,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.background,
  },
  badgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "700",
  },
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    marginTop: 4,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIconContainer: {
    marginRight: 12,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 15,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  bannerContainer: {
    marginBottom: 24,
  },
  bannerContent: {
    paddingLeft: 20,
    paddingRight: 8,
  },
  banner: {
    marginRight: 12,
  },
  firstBanner: {
    marginLeft: 0,
  },
  bannerGradient: {
    width: 280,
    height: 140,
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  bannerIcon: {
    marginRight: 16,
  },
  bannerIconInner: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFF",
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: "#FFF",
    opacity: 0.95,
    fontWeight: "500",
    marginBottom: 8,
  },
  bannerArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 16,
    paddingHorizontal: 20,
    letterSpacing: -0.3,
  },
  categoryContent: {
    paddingLeft: 20,
    paddingRight: 8,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 16,
  },
  categoryIconGradient: {
    width: 68,
    height: 68,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  categoryText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sectionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    overflow: "hidden",
  },
  sectionIconGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
    fontWeight: "500",
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  seeAll: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "600",
  },
  horizontalScroll: {
    paddingLeft: 20,
  },
  horizontalScrollContent: {
    paddingRight: 8,
  },
  horizontalCard: {
    marginRight: 12,
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
  },
  productCard: {
    width: PRODUCT_WIDTH,
    backgroundColor: "#FFF",
    borderRadius: 16,
    marginHorizontal: 4,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  productImageContainer: {
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: PRODUCT_WIDTH,
    backgroundColor: "#F9FAFB",
  },
  imageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  discountBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    borderRadius: 8,
    overflow: "hidden",
  },
  discountGradient: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  discountText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  shareButtonOverlay: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  shareIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
    height: 38,
    fontWeight: "600",
    letterSpacing: -0.2,
    lineHeight: 19,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.primary,
    marginRight: 8,
    letterSpacing: -0.3,
  },
  originalPrice: {
    fontSize: 13,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
    fontWeight: "500",
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 8,
  },
  soldText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: 11,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  ctaBannerContainer: {
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
  },
  ctaContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 16,
  },
  ctaIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  ctaTextContainer: {
    flex: 1,
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFF",
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  ctaSubtitle: {
    fontSize: 13,
    color: "#FFF",
    opacity: 0.95,
    fontWeight: "500",
  },
  ctaArrow: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingSpinner: {
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 15,
    color: "#9CA3AF",
    fontWeight: "500",
  },
});
