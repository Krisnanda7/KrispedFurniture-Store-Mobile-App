// app/(tabs)/explore.tsx
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import colors from "../../constants/theme";
import { supabase } from "../../lib/supabase";

const { width } = Dimensions.get("window");
const PRODUCT_WIDTH = (width - 48) / 2;

const CATEGORIES = [
  { id: 1, name: "Kursi & Sofa", icon: "bed-outline" },
  { id: 2, name: "Meja & Lemari", icon: "desktop-outline" },
];

const SORT_OPTIONS = [
  { id: "latest", name: "Terbaru", icon: "time-outline" },
  { id: "popular", name: "Terpopuler", icon: "flame-outline" },
  { id: "price-low", name: "Harga Terendah", icon: "arrow-down-outline" },
  { id: "price-high", name: "Harga Tertinggi", icon: "arrow-up-outline" },
  { id: "rating", name: "Rating Tertinggi", icon: "star-outline" },
];

const PRICE_RANGES = [
  { id: "all", name: "Semua Harga", min: 0, max: 999999999 },
  { id: "under-1m", name: "Di bawah 1 Juta", min: 0, max: 1000000 },
  { id: "1m-3m", name: "1 - 3 Juta", min: 1000000, max: 3000000 },
  { id: "3m-5m", name: "3 - 5 Juta", min: 3000000, max: 5000000 },
  { id: "above-5m", name: "Di atas 5 Juta", min: 5000000, max: 999999999 },
];

export default function Explore() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedSort, setSelectedSort] = useState("latest");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedSort,
    selectedPriceRange,
  ]);

  const getProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("products").select("*");
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== null) {
      filtered = filtered.filter((p) => p.category_id === selectedCategory);
    }

    // Filter by price range
    const priceRange = PRICE_RANGES.find((r) => r.id === selectedPriceRange);
    if (priceRange) {
      filtered = filtered.filter(
        (p) => p.price >= priceRange.min && p.price <= priceRange.max
      );
    }

    // Sort products
    switch (selectedSort) {
      case "latest":
        filtered.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "popular":
        filtered.sort((a, b) => (b.sold || 0) - (a.sold || 0));
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }

    setFilteredProducts(filtered);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSelectedSort("latest");
    setSelectedPriceRange("all");
  };

  const activeFiltersCount = () => {
    let count = 0;
    if (selectedCategory !== null) count++;
    if (selectedSort !== "latest") count++;
    if (selectedPriceRange !== "all") count++;
    return count;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Jelajahi Produk</Text>
        <TouchableOpacity>
          <Ionicons
            name="notifications-outline"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#8E8E8E" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari furniture..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#8E8E8E"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#8E8E8E" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons name="options-outline" size={20} color={colors.primary} />
          {activeFiltersCount() > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFiltersCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Filter Panel */}
      {showFilters && (
        <View style={styles.filterPanel}>
          {/* Category Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Kategori</Text>
            <View style={styles.categoryButtons}>
              <TouchableOpacity
                style={[
                  styles.categoryButton,
                  selectedCategory === null && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(null)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === null &&
                      styles.categoryButtonTextActive,
                  ]}
                >
                  Semua
                </Text>
              </TouchableOpacity>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryButton,
                    selectedCategory === cat.id && styles.categoryButtonActive,
                  ]}
                  onPress={() => setSelectedCategory(cat.id)}
                >
                  <Ionicons
                    name={cat.icon as any}
                    size={16}
                    color={
                      selectedCategory === cat.id ? colors.primary : "#8E8E8E"
                    }
                  />
                  <Text
                    style={[
                      styles.categoryButtonText,
                      selectedCategory === cat.id &&
                        styles.categoryButtonTextActive,
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Price Range Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Rentang Harga</Text>
            <View style={styles.priceRangeButtons}>
              {PRICE_RANGES.map((range) => (
                <TouchableOpacity
                  key={range.id}
                  style={[
                    styles.priceButton,
                    selectedPriceRange === range.id && styles.priceButtonActive,
                  ]}
                  onPress={() => setSelectedPriceRange(range.id)}
                >
                  <Text
                    style={[
                      styles.priceButtonText,
                      selectedPriceRange === range.id &&
                        styles.priceButtonTextActive,
                    ]}
                  >
                    {range.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Clear Filters Button */}
          {activeFiltersCount() > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
              <Text style={styles.clearButtonText}>Reset Filter</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Sort Options */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.sortContainer}
      >
        {SORT_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.sortChip,
              selectedSort === option.id && styles.sortChipActive,
            ]}
            onPress={() => setSelectedSort(option.id)}
          >
            <Ionicons
              name={option.icon as any}
              size={16}
              color={selectedSort === option.id ? colors.primary : "#8E8E8E"}
            />
            <Text
              style={[
                styles.sortChipText,
                selectedSort === option.id && styles.sortChipTextActive,
              ]}
            >
              {option.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          {loading
            ? "Memuat..."
            : `${filteredProducts.length} Produk ditemukan`}
        </Text>
      </View>

      {/* Product Grid */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Memuat produk...</Text>
          </View>
        ) : filteredProducts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={64} color="#CCCCCC" />
            <Text style={styles.emptyText}>Produk tidak ditemukan</Text>
            <Text style={styles.emptySubtext}>
              Coba ubah filter atau kata kunci pencarian
            </Text>
            {activeFiltersCount() > 0 && (
              <TouchableOpacity
                style={styles.resetButton}
                onPress={clearFilters}
              >
                <Text style={styles.resetButtonText}>Reset Semua Filter</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.productGrid}>
            {filteredProducts.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.productCard}
                onPress={() => router.push(`/product/${item.id}`)}
              >
                <Image
                  source={{
                    uri: item.image_url || "https://via.placeholder.com/200",
                  }}
                  style={styles.productImage}
                  resizeMode="cover"
                />

                {item.discount && (
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>{item.discount}%</Text>
                  </View>
                )}

                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {item.title}
                  </Text>

                  <View style={styles.priceContainer}>
                    <Text style={styles.productPrice}>
                      {formatPrice(item.price)}
                    </Text>
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
                    <Ionicons
                      name="location-outline"
                      size={12}
                      color="#8E8E8E"
                    />
                    <Text style={styles.locationText}>
                      {item.location || "Jakarta"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
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
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  filterButton: {
    width: 44,
    height: 44,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  filterBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  filterBadgeText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "bold",
  },
  filterPanel: {
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  filterSection: {
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  categoryButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFF",
    gap: 4,
  },
  categoryButtonActive: {
    borderColor: colors.primary,
    backgroundColor: "#F0F8FF",
  },
  categoryButtonText: {
    fontSize: 13,
    color: "#8E8E8E",
  },
  categoryButtonTextActive: {
    color: colors.primary,
    fontWeight: "600",
  },
  priceRangeButtons: {
    gap: 8,
  },
  priceButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFF",
  },
  priceButtonActive: {
    borderColor: colors.primary,
    backgroundColor: "#F0F8FF",
  },
  priceButtonText: {
    fontSize: 13,
    color: "#8E8E8E",
  },
  priceButtonTextActive: {
    color: colors.primary,
    fontWeight: "600",
  },
  clearButton: {
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  clearButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  sortContainer: {
    paddingLeft: 16,
    paddingVertical: 12,
    maxHeight: 60,
  },
  sortChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFF",
    marginRight: 8,
    gap: 4,
  },
  sortChipActive: {
    borderColor: colors.primary,
    backgroundColor: "#F0F8FF",
  },
  sortChipText: {
    fontSize: 13,
    color: "#8E8E8E",
  },
  sortChipTextActive: {
    color: colors.primary,
    fontWeight: "600",
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultsText: {
    fontSize: 13,
    color: "#8E8E8E",
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 14,
    color: "#8E8E8E",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
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
    marginTop: 8,
    textAlign: "center",
  },
  resetButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  resetButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
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
});
