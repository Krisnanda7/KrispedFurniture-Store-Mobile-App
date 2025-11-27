import { useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import colors from "../../constants/theme";
import { supabase } from "../../lib/supabase";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);

  const USER_ID = 1;

  const fetchCart = async () => {
    const { data, error } = await supabase
      .from("cart")
      .select(
        `
      id,
      quantity,
      products (
        id,
        title,
        price,
        image_url
      )
    `
      )
      .eq("user_id", USER_ID);

    if (!error) setCartItems(data);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <ScrollView style={{ padding: 16, backgroundColor: colors.background }}>
      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          color: colors.text,
          marginBottom: 12,
        }}
      >
        Keranjang Belanja
      </Text>

      {cartItems.length === 0 ? (
        <Text style={{ color: "#999" }}>Keranjang masih kosong.</Text>
      ) : (
        cartItems.map((item) => (
          <View
            key={item.id}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
              backgroundColor: "#fff",
              borderRadius: 10,
              padding: 10,
            }}
          >
            <Image
              source={{ uri: item.products.image_url }}
              style={{ width: 70, height: 70, borderRadius: 8 }}
            />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                {item.products.title}
              </Text>
              <Text style={{ color: colors.primary, marginTop: 4 }}>
                Rp {item.products.price.toLocaleString()}
              </Text>
              <Text style={{ color: "#666", marginTop: 4 }}>
                Qty: {item.quantity}
              </Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}
