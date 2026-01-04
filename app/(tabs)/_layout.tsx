// app/(tabs)/_layout.tsx
import { Ionicons } from "@expo/vector-icons";
import Airbridge from "airbridge-react-native-sdk";
import { Tabs } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import colors from "../../constants/theme";
import { useCart } from "../../context/CartContext";

function CartIcon({ color }: { color: string }) {
  const { getCartItemsCount } = useCart();
  const count = getCartItemsCount();

  useEffect(() => {
    if (Airbridge && (Airbridge as any).init) {
      (Airbridge as any).init(
        "krispedfurnitureapp",
        "df88f79d2b414d4390ad5bef3aba767c"
      );
    } else {
      console.log("Airbridge is not available");
    }
  }, []);

  return (
    <View style={styles.iconContainer}>
      <Ionicons name="cart-outline" size={22} color={color} />
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count > 99 ? "99+" : count}</Text>
        </View>
      )}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "#8E8E8E",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <Ionicons name="search-outline" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color }) => <CartIcon color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -10,
    backgroundColor: "#FF4444",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },
});
