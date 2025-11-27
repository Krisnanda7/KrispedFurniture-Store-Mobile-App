import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import colors from "../constants/theme";
import { router } from "expo-router";

export default function ProductCard({ item }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.price}>Rp {item.price.toLocaleString()}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginVertical: 10,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 140,
    borderRadius: 10,
  },
  title: {
    marginTop: 8,
    fontWeight: "600",
    color: colors.text,
  },
  price: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
  },
});
