// app/admin/index.tsx - TOUCHABLE FIXED
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Pressable,
} from "react-native";
import colors from "../../constants/theme";
import { supabase } from "../../lib/supabase";

export default function AdminDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    withDiscount: 0,
    outOfStock: 0,
  });

  useFocusEffect(
    useCallback(() => {
      console.log("📱 Screen focused - Loading products...");
      loadProducts();
    }, [])
  );

  const loadProducts = async () => {
    try {
      setLoading(true);
      console.log("🔄 Loading products from Supabase...");

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ Supabase error:", error);
        throw error;
      }

      console.log(`✅ Loaded ${data?.length || 0} products`);
      setProducts(data || []);

      const total = data?.length || 0;
      const withDiscount = data?.filter((p) => p.discount)?.length || 0;
      const outOfStock = data?.filter((p) => p.stock === 0)?.length || 0;

      setStats({ total, withDiscount, outOfStock });
    } catch (error) {
      console.error("❌ Error loading products:", error);
      Alert.alert("Error", "Gagal memuat produk: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    console.log("🔄 Manual refresh triggered");
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  const handleDeleteProduct = async (productId, productName) => {
    console.log("🗑️ handleDeleteProduct CALLED!");
    console.log("Product ID:", productId);
    console.log("Product ID Type:", typeof productId);
    console.log("Product Name:", productName);

    // Step 1: Verify product exists first
    try {
      console.log("Step 1: Checking if product exists...");
      const { data: checkData, error: checkError } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      console.log("Check data:", checkData);
      console.log("Check error:", checkError);

      if (checkError) {
        console.error("❌ Product not found:", checkError);
        Alert.alert("Error", "Produk tidak ditemukan");
        return;
      }
    } catch (e) {
      console.error("❌ Check failed:", e);
      Alert.alert("Error", "Gagal memeriksa produk");
      return;
    }

    // Step 2: Show confirmation dialog
    Alert.alert(
      "Hapus Produk",
      `Yakin ingin menghapus "${productName}"?\n\nID: ${productId}`,
      [
        {
          text: "Batal",
          style: "cancel",
          onPress: () => console.log("❌ Delete cancelled"),
        },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            console.log("💥 Delete confirmed! Starting deletion...");

            try {
              // Step 3: Execute delete
              console.log("Step 3: Executing DELETE query...");
              console.log("DELETE FROM products WHERE id =", productId);

              const { data, error, status, statusText } = await supabase
                .from("products")
                .delete()
                .eq("id", productId)
                .select();

              console.log("=== DELETE RESPONSE ===");
              console.log("Status:", status);
              console.log("Status Text:", statusText);
              console.log("Data:", data);
              console.log("Error:", error);
              console.log("=====================");

              if (error) {
                console.error("❌ Supabase delete error:");
                console.error("  Message:", error.message);
                console.error("  Details:", error.details);
                console.error("  Hint:", error.hint);
                console.error("  Code:", error.code);
                throw error;
              }

              if (!data || data.length === 0) {
                console.log(
                  "⚠️ Delete returned no data (might be already deleted)"
                );
                Alert.alert(
                  "Perhatian",
                  "Produk mungkin sudah dihapus sebelumnya"
                );
                await loadProducts();
                return;
              }

              console.log("✅ Delete successful! Deleted item:", data[0]);

              // Step 4: Update local state
              console.log("Step 4: Updating local state...");
              setProducts((prev) => {
                const filtered = prev.filter((p) => p.id !== productId);
                console.log(
                  `Products count: ${prev.length} -> ${filtered.length}`
                );
                return filtered;
              });

              setStats((prev) => ({
                ...prev,
                total: Math.max(0, prev.total - 1),
              }));

              Alert.alert("✅ Berhasil", "Produk berhasil dihapus!");

              // Step 5: Reload from server
              console.log("Step 5: Reloading from server...");
              setTimeout(async () => {
                await loadProducts();
                console.log("✅ Reload complete");
              }, 500);
            } catch (error) {
              console.error("❌ DELETE OPERATION FAILED!");
              console.error("Error object:", error);
              console.error("Error message:", error.message);
              console.error("Error stack:", error.stack);

              Alert.alert(
                "Error",
                `Gagal menghapus produk\n\nDetail: ${error.message}\n\nCek console untuk info lengkap`
              );

              // Reload to restore correct state
              await loadProducts();
            }
          },
        },
      ]
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.headerSubtitle}>Kelola Produk Furniture</Text>
        </View>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.withDiscount}</Text>
          <Text style={styles.statLabel}>Diskon</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.outOfStock}</Text>
          <Text style={styles.statLabel}>Habis</Text>
        </View>
      </View>

      {/* Add Product Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          console.log("➕ Add product clicked");
          router.push("/admin/addProduct");
        }}
      >
        <Ionicons name="add-circle" size={24} color="#FFF" />
        <Text style={styles.addButtonText}>Tambah Produk Baru</Text>
      </TouchableOpacity>

      {/* Products List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Memuat produk...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.productsList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {products.map((product) => (
            <View key={product.id} style={styles.productCard}>
              <Image
                source={{
                  uri: product.image_url || "https://via.placeholder.com/100",
                }}
                style={styles.productImage}
              />

              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>
                  {product.title}
                </Text>
                <Text style={styles.productPrice}>
                  {formatPrice(product.price)}
                </Text>
                <View style={styles.productMeta}>
                  <Text style={styles.metaText}>Stok: {product.stock}</Text>
                  <Text style={styles.metaText}>•</Text>
                  <Text style={styles.metaText}>
                    Terjual: {product.sold || 0}
                  </Text>
                </View>
              </View>

              {/* CHANGED: Use separate container with pointerEvents */}
              <View style={styles.productActions} pointerEvents="box-none">
                {/* Edit Button - Using Pressable for better debugging */}
                <Pressable
                  style={({ pressed }) => [
                    styles.actionButton,
                    styles.editButton,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={() => {
                    console.log("✏️ Edit clicked for:", product.id);
                    router.push({
                      pathname: "/admin/editProduct",
                      params: { id: product.id },
                    });
                  }}
                >
                  <Ionicons name="create" size={20} color="#3B82F6" />
                </Pressable>

                {/* Delete Button - Using Pressable with explicit hit area */}
                <Pressable
                  style={({ pressed }) => [
                    styles.actionButton,
                    styles.deleteButton,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={() => {
                    console.log("🗑️ DELETE BUTTON PRESSED!");
                    console.log("Product:", product.title);
                    handleDeleteProduct(product.id, product.title);
                  }}
                  hitSlop={8}
                  testID={`delete-${product.id}`}
                >
                  {({ pressed }) => (
                    <>
                      <Ionicons
                        name="trash"
                        size={20}
                        color={pressed ? "#DC2626" : "#EF4444"}
                      />
                      {pressed && (
                        <Text style={styles.debugText}>PRESSED!</Text>
                      )}
                    </>
                  )}
                </Pressable>
              </View>
            </View>
          ))}

          {products.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="cube-outline" size={64} color="#CCCCCC" />
              <Text style={styles.emptyText}>Belum ada produk</Text>
              <Text style={styles.emptySubtext}>
                Tambahkan produk pertama Anda
              </Text>
            </View>
          )}

          {/* Test Button - untuk memastikan Alert bekerja */}
          <Pressable
            style={styles.testButton}
            onPress={() => {
              console.log("TEST BUTTON CLICKED!");
              Alert.alert("Test", "Alert berfungsi!");
            }}
          >
            <Text style={styles.testButtonText}>🧪 Test Alert</Text>
          </Pressable>

          <View style={{ height: 20 }} />
        </ScrollView>
      )}
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
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#8E8E8E",
    marginTop: 2,
  },
  statsBar: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: "#8E8E8E",
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 8,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: "#8E8E8E",
  },
  productsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  productName: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 6,
  },
  productMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metaText: {
    fontSize: 12,
    color: "#8E8E8E",
  },
  productActions: {
    flexDirection: "column",
    gap: 8,
    justifyContent: "center",
    // Added explicit dimensions
    width: 48,
    height: 96,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    // Ensure button is touchable
    backgroundColor: "#FFF",
  },
  editButton: {
    backgroundColor: "#EFF6FF",
  },
  deleteButton: {
    backgroundColor: "#FEF2F2",
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  debugText: {
    fontSize: 8,
    color: "#EF4444",
    position: "absolute",
    bottom: 2,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#8E8E8E",
    marginTop: 4,
  },
  testButton: {
    backgroundColor: "#10B981",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
  },
  testButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
