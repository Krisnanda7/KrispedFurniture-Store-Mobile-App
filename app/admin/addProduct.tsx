// app/admin/add-product.tsx
import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";
import colors from "../../constants/theme";

export default function AddProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    original_price: "",
    discount: "",
    image_url: "",
    category_id: "1",
    stock: "",
    rating: "4.5",
    sold: "0",
    location: "Jakarta",
  });

  const handleSubmit = async () => {
    // Validation
    if (!formData.title || !formData.price || !formData.stock) {
      Alert.alert("Error", "Nama produk, harga, dan stok wajib diisi!");
      return;
    }

    try {
      setLoading(true);

      // Calculate discount if original_price exists
      let calculatedDiscount = formData.discount;
      if (formData.original_price && formData.price) {
        const discount =
          ((parseFloat(formData.original_price) - parseFloat(formData.price)) /
            parseFloat(formData.original_price)) *
          100;
        calculatedDiscount = Math.round(discount).toString();
      }

      const productData = {
        title: formData.title,
        description: formData.description || null,
        price: parseFloat(formData.price),
        original_price: formData.original_price
          ? parseFloat(formData.original_price)
          : null,
        discount: calculatedDiscount ? parseInt(calculatedDiscount) : null,
        image_url: formData.image_url || null,
        category_id: parseInt(formData.category_id),
        stock: parseInt(formData.stock),
        rating: parseFloat(formData.rating),
        sold: parseInt(formData.sold),
        location: formData.location,
      };

      const { data, error } = await supabase
        .from("products")
        .insert([productData])
        .select();

      if (error) throw error;

      Alert.alert("Berhasil!", "Produk berhasil ditambahkan", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);

      console.log("✅ Product added:", data);
    } catch (error) {
      console.error("Error adding product:", error);
      Alert.alert(
        "Error",
        "Gagal menambahkan produk. Cek console untuk detail."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tambah Produk</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Name */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Nama Produk <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Contoh: Sofa Minimalis Modern"
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
          />
        </View>

        {/* Description */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Deskripsi</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Deskripsi produk..."
            value={formData.description}
            onChangeText={(text) =>
              setFormData({ ...formData, description: text })
            }
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Price */}
        <View style={styles.row}>
          <View style={[styles.formGroup, styles.halfWidth]}>
            <Text style={styles.label}>
              Harga <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="3500000"
              value={formData.price}
              onChangeText={(text) => setFormData({ ...formData, price: text })}
              keyboardType="numeric"
            />
          </View>

          <View style={[styles.formGroup, styles.halfWidth]}>
            <Text style={styles.label}>Harga Asli</Text>
            <TextInput
              style={styles.input}
              placeholder="5000000"
              value={formData.original_price}
              onChangeText={(text) =>
                setFormData({ ...formData, original_price: text })
              }
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Category & Stock */}
        <View style={styles.row}>
          <View style={[styles.formGroup, styles.halfWidth]}>
            <Text style={styles.label}>Kategori</Text>
            <View style={styles.pickerContainer}>
              <TouchableOpacity
                style={[
                  styles.categoryButton,
                  formData.category_id === "1" && styles.categoryButtonActive,
                ]}
                onPress={() => setFormData({ ...formData, category_id: "1" })}
              >
                <Text
                  style={[
                    styles.categoryText,
                    formData.category_id === "1" && styles.categoryTextActive,
                  ]}
                >
                  Kursi & Sofa
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.categoryButton,
                  formData.category_id === "2" && styles.categoryButtonActive,
                ]}
                onPress={() => setFormData({ ...formData, category_id: "2" })}
              >
                <Text
                  style={[
                    styles.categoryText,
                    formData.category_id === "2" && styles.categoryTextActive,
                  ]}
                >
                  Meja & Lemari
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.formGroup, styles.halfWidth]}>
            <Text style={styles.label}>
              Stok <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="10"
              value={formData.stock}
              onChangeText={(text) => setFormData({ ...formData, stock: text })}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Image URL */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>URL Gambar</Text>
          <TextInput
            style={styles.input}
            placeholder="https://images.unsplash.com/..."
            value={formData.image_url}
            onChangeText={(text) =>
              setFormData({ ...formData, image_url: text })
            }
          />
          <Text style={styles.hint}>
            💡 Gunakan URL dari Unsplash atau layanan hosting gambar lainnya
          </Text>
        </View>

        {/* Location */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Lokasi</Text>
          <TextInput
            style={styles.input}
            placeholder="Jakarta"
            value={formData.location}
            onChangeText={(text) =>
              setFormData({ ...formData, location: text })
            }
          />
        </View>

        {/* Rating & Sold */}
        <View style={styles.row}>
          <View style={[styles.formGroup, styles.halfWidth]}>
            <Text style={styles.label}>Rating</Text>
            <TextInput
              style={styles.input}
              placeholder="4.5"
              value={formData.rating}
              onChangeText={(text) =>
                setFormData({ ...formData, rating: text })
              }
              keyboardType="decimal-pad"
            />
          </View>

          <View style={[styles.formGroup, styles.halfWidth]}>
            <Text style={styles.label}>Terjual</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              value={formData.sold}
              onChangeText={(text) => setFormData({ ...formData, sold: text })}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <Text style={styles.submitButtonText}>Menyimpan...</Text>
          ) : (
            <>
              <Ionicons name="add-circle" size={24} color="#FFF" />
              <Text style={styles.submitButtonText}>Tambah Produk</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    paddingBottom: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  required: {
    color: "#EF4444",
  },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  hint: {
    fontSize: 12,
    color: "#8E8E8E",
    marginTop: 4,
  },
  pickerContainer: {
    gap: 8,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    backgroundColor: "#FFF",
  },
  categoryButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + "10",
  },
  categoryText: {
    fontSize: 14,
    color: "#8E8E8E",
    textAlign: "center",
  },
  categoryTextActive: {
    color: colors.primary,
    fontWeight: "600",
  },
  footer: {
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
});
